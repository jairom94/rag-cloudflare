# RAG Simple con Cloudflare Workers

Este proyecto es un ejemplo simple de un sistema de Generación Aumentada por Recuperación (RAG) implementado utilizando Cloudflare Workers, Vectorize y Workers AI. Permite cargar documentos en una base de datos vectorial y realizar consultas para obtener respuestas generadas por IA basadas en el contexto recuperado.

## Características

- **Carga de documentos**: Endpoint `/load` para cargar documentos en el índice vectorial utilizando embeddings generados por el modelo `@cf/baai/bge-base-en-v1.5`.
- **Consultas RAG**: Endpoint `/query` para hacer preguntas, buscar en la base de datos vectorial y generar respuestas utilizando el modelo `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.
- **Base de conocimiento**: Incluye una base de conocimiento predefinida con información sobre Cloudflare Workers, Vectorize, Workers AI, conceptos de RAG y embeddings.
- **Autenticación**: Utiliza un secreto `LOAD_SECRET` para proteger los endpoints de carga y consulta.
- **Compatibilidad con Node.js**: Habilitada para mayor flexibilidad en el código.

## Requisitos

- Cuenta de Cloudflare
- Wrangler CLI instalado (`npm install -g wrangler`)
- Acceso a Vectorize y Workers AI (disponibles en planes gratuitos y pagos)

## Instalación

1. Clona este repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd rag-simple
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura Wrangler con tu cuenta de Cloudflare:

   ```bash
   npx wrangler auth login
   ```

4. Crea un índice Vectorize (si no existe):

   ```bash
   npx wrangler vectorize create rag-tutorial-index --dimensions=768 --metric=cosine
   ```

5. Establece el secreto `LOAD_SECRET`:
   ```bash
   npx wrangler secret put LOAD_SECRET
   ```
   (Ingresa un valor secreto cuando se te solicite)

## Uso

### Desarrollo local

Ejecuta el worker en modo desarrollo:

```bash
npm run dev
```

### Despliegue

Despliega el worker a Cloudflare:

```bash
npm run deploy
```

### Endpoints

- **GET /**: Respuesta simple para verificar que el worker está funcionando.
- **POST /load**: Carga los documentos de la base de conocimiento en el índice vectorial. Requiere el header `X-Load-Secret` con el valor del secreto configurado.
- **POST /query**: Realiza una consulta RAG. Envía un JSON con `{"question": "tu pregunta"}`. Requiere el header `X-Load-Secret`.

Ejemplo de consulta con curl:

```bash
curl -X POST https://tu-worker.cloudflare.workers.dev/query \
  -H "Content-Type: application/json" \
  -H "X-Load-Secret: tu-secreto" \
  -d '{"question": "¿Qué es Vectorize?"}'
```

## Estructura del proyecto

- `src/index.ts`: Código principal del worker.
- `scripts/knowledge-base.ts`: Base de conocimiento con documentos predefinidos.
- `wrangler.jsonc`: Configuración de Wrangler.
- `package.json`: Dependencias y scripts.

## Pruebas

Ejecuta las pruebas con:

```bash
npm test
```

## Contribución

Siéntete libre de contribuir con mejoras o reportar issues.

## Licencia

Este proyecto es de código abierto. Consulta el archivo de licencia para más detalles.
