import { generatePrompt, generateFallbackDocumentation } from "@/utils/sharedFn";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const generateDocumentation = async (name, description, code, tags = []) => {
  try {
    const prompt = generatePrompt(name, description, code, tags);
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text(); // Leer mensaje de error
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "**Error:** No se pudo generar la documentación.";
  } catch (error) {
    console.error("❌ Error al generar la documentación:", error.message);
    // return "**Error:** No se pudo generar la documentación.";
    console.log("Generating fallback documentation");
    return generateFallbackDocumentation(name, description, code, tags);
  }
};