import { documents } from '../scripts/knowledge-base';

export interface Env {
	VECTORIZE: VectorizeIndex;
	AI: Ai;
	LOAD_SECRET: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === '/load' && request.method === 'POST') {
			return handleLoad(env, request);
		}
		if (url.pathname === '/query' && request.method === 'POST') {
			return handleQuery(request, env);
		}
		return new Response('El RAG simple tutorial esta funcionado!', {
			status: 200,
		});
	},
} satisfies ExportedHandler<Env>;

async function handleLoad(env: Env, request: Request): Promise<Response> {
	const authHeader = request.headers.get('X-Load-Secret');
	if (authHeader !== env.LOAD_SECRET) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}
	const results: { id: string; status: string }[] = [];
	for (const doc of documents) {
		const response = (await env.AI.run('@cf/baai/bge-base-en-v1.5', {
			text: [doc.text],
		})) as { data: number[][] };
		await env.VECTORIZE.upsert([
			{
				id: doc.id,
				values: response.data[0],
				metadata: {
					...doc.metadata,
					text: doc.text,
				},
			},
		]);
		results.push({
			id: doc.id,
			status: 'loaded',
		});
	}
	return Response.json({
		success: true,
		loaded: results,
	});
}

async function handleQuery(request: Request, env: Env): Promise<Response> {
	const authHeader = request.headers.get('X-Load-Secret');
	if (authHeader !== env.LOAD_SECRET) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}
	let body: { question: string };
	try {
		body = (await request.json()) as { question: string };
	} catch (error) {
		return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
	}

	if (!body.question || typeof body.question !== 'string' || body.question.trim() === '') {
		return Response.json({ error: 'question must be a non-empty string' }, { status: 400 });
	}

	const question = body.question.trim().slice(0, 500);

	let embeddingResponse: { data: number[][] };
	try {
		embeddingResponse = (await env.AI.run('@cf/baai/bge-base-en-v1.5', {
			text: [body.question],
		})) as { data: number[][] };
	} catch (error) {
		console.error('Error generating embedding:', error);
		return Response.json({ error: 'Error al procesar la pregunta con el modelo de embeddings' }, { status: 503 });
	}

	let searchResults: Awaited<ReturnType<typeof env.VECTORIZE.query>>;
	try {
		searchResults = await env.VECTORIZE.query(embeddingResponse.data[0], {
			topK: 3,
			returnMetadata: 'all',
		});
	} catch (error) {
		console.error('Error querying vector database:', error);
		return Response.json({ error: 'Error al buscar en la base de datos vectorial' }, { status: 503 });
	}

	const context = searchResults.matches
		.filter((match) => match.score > 0.5)
		.map((match) => match.metadata?.text as string)
		.filter(Boolean)
		.join('\n\n');

	if (!context) {
		return Response.json({
			answer: 'Lo siento, no pude encontrar información relevante para tu pregunta.',
			sources: [],
		});
	}

	let aiResponse: { response: string };
	try {
		aiResponse = (await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
			messages: [
				{
					role: 'system',
					content:
						'Eres un asistente útil y preciso. Responde a la pregunta utilizando solo el contexto proporcionado. Si no sabes la respuesta, di que no lo sabes. No inventes información.',
				},
				{
					role: 'user',
					content: `Contexto:\n${context}\n\nPregunta:\n${body.question}`,
				},
			],
			max_tokens: 256,
		})) as { response: string };
	} catch (error) {
		console.error('Error generating AI response:', error);
		return Response.json({ error: 'Error al generar la respuesta con el modelo de lenguaje' }, { status: 503 });
	}

	const sources = searchResults.matches
		.filter((match) => match.score > 0.5)
		.map((match) => match.metadata?.source as string)
		.filter(Boolean);

	return Response.json({
		answer: aiResponse.response,
		sources: [...new Set(sources)],
	});
}
