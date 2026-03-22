import { documents} from '../scripts/knowledge-base';

export interface Env {
	VECTORIZE: VectorizeIndex;
	AI:Ai,
	LOAD_SECRET: string;
}

export default {
	async fetch(request: Request, env:Env): Promise<Response> {
		const url = new URL(request.url)
		if(url.pathname === "/load" && request.method === "POST"){
			return handleLoad(env,request);
		}
		return new Response("El RAG simple tutorial esta funcionado!",{
			status:200
		});
	},	
} satisfies ExportedHandler<Env>;

async function handleLoad(env:Env, request:Request):Promise<Response> {
	const authHeader = request.headers.get("X-Load-Secret");
	if(authHeader !== env.LOAD_SECRET){
		return Response.json({error:"Unauthorized"},{status:401});
	}
	const results:{id:string;status:string}[] = [];
	for (const doc of documents){
		const response = await env.AI.run("@cf/baai/bge-base-en-v1.5",{
			text:[doc.text],
		}) as { data:number[][]};
		await env.VECTORIZE.upsert([
			{
				id:doc.id,
				values:response.data[0],
				metadata:{
					...doc.metadata,
					text:doc.text
				}
			}
		]);
		results.push({
			id:doc.id,
			status:"loaded"
		})
	}
	return Response.json({
		success:true,
		loaded:results
	})
}
