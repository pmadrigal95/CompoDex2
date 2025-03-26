// // src/helpers/openaiHelper.js

import { generatePrompt, generateFallbackDocumentation } from "@/utils/sharedFn";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export const generateDocumentation = async (name, description, code, tags) => {
    try {  
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "Eres un experto en documentación técnica de Vue.js. Genera documentación en español, bien estructurada y clara." },
            { role: "user", content: generatePrompt(name, description, code, tags) },
          ],
          max_tokens: 2000,
        }),
      });
  
      if (!response.ok) throw new Error(`Error de API: ${response.statusText}`);
  
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "**Error:** No se pudo generar la documentación.";
    } catch (error) {
      console.error("Error al generar la documentación:", error);
      // return "**Error:** No se pudo generar la documentación.";
      console.log("Generating fallback documentation");
      return generateFallbackDocumentation(name, description, code, tags);
    }
  };