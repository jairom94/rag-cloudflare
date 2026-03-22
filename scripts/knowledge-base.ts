export const documents = [
  {
    id: "1",
    text: "Cloudflare Workers ejecuta JavaScript en el edge, en más de 300 centros de datos en todo el mundo. Las solicitudes se manejan cerca del usuario, reduciendo significativamente la latencia en comparación con un servidor en una sola región.",
    metadata: { source: "cloudflare-docs", category: "workers" },
  },
  {
    id: "2",
    text: "Vectorize es la base de datos vectorial de Cloudflare. Almacena embeddings y permite buscarlos por similitud semántica. Se ejecuta en la misma red que tu Worker, por lo que no se necesita una llamada a una API externa.",
    metadata: { source: "cloudflare-docs", category: "vectorize" },
  },
  {
    id: "3",
    text: "Workers AI te permite ejecutar modelos de aprendizaje automático directamente en la infraestructura de Cloudflare. Puedes generar embeddings y ejecutar inferencia de LLM sin salir de la red de Cloudflare.",
    metadata: { source: "cloudflare-docs", category: "workers-ai" },
  },
  {
    id: "4",
    text: "RAG significa Generación Aumentada por Recuperación. En lugar de depender únicamente de lo que el LLM fue entrenado, RAG recupera contexto relevante desde una base de conocimiento y lo agrega al prompt antes de generar una respuesta.",
    metadata: { source: "ai-concepts", category: "rag" },
  },
  {
    id: "5",
    text: "Un embedding es una representación numérica de un texto. Textos similares producen embeddings similares. Esto es lo que hace posible la búsqueda semántica: buscas por significado, no por palabras clave exactas.",
    metadata: { source: "ai-concepts", category: "embeddings" },
  },
  {
    id: "6",
    text: "El modelo BGE (bge-base-en-v1.5) está disponible a través de Workers AI. Genera embeddings de 768 dimensiones y funciona bien para tareas de búsqueda semántica en inglés.",
    metadata: { source: "cloudflare-docs", category: "workers-ai" },
  },
  {
    id: "7",
    text: "La similitud del coseno mide el ángulo entre dos vectores. Para embeddings de texto, captura la similitud semántica independientemente de la longitud del texto, lo que la hace más confiable que la distancia euclidiana.",
    metadata: { source: "ai-concepts", category: "embeddings" },
  },
  {
    id: "8",
    text: "Cloudflare Workers tiene un plan gratuito que incluye 100,000 solicitudes por día. Vectorize está disponible tanto en los planes Free como Paid de Workers. El plan gratuito permite crear prototipos y experimentar. El plan Paid de Workers comienza en $5 al mes e incluye mayores límites de uso para cargas de trabajo en producción.",
    metadata: { source: "cloudflare-docs", category: "pricing" },
  },
];