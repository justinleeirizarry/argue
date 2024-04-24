export const config = {
  useOllamaInference: false,
  useOllamaEmbeddings: false,
  inferenceModel: "mixtral-8x7b-32768",
  inferenceAPIKey: process.env.GROQ_API_KEY,
  embeddingsModel: "text-embedding-3-small",
  textChunkSize: 1000, // Recommended to decrease for Ollama
  textChunkOverlap: 400, // Recommended to decrease for Ollama
  numberOfSimilarityResults: 4, // Numbher of similarity results to return per page
  numberOfPagesToScan: 10, // Recommended to decrease for Ollama
  nonOllamaBaseURL: "https://api.groq.com/openai/v1", //Groq: https://api.groq.com/openai/v1 // OpenAI: https://api.openai.com/v1

  // Set LAN GPU server, example: http://192.168.1.100:11434/v1
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
};
