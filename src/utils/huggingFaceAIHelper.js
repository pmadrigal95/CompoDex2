import { generatePrompt, generateFallbackDocumentation } from "@/utils/sharedFn";

const apiKey = import.meta.env.VITE_HF_API_KEY;

export const generateDocumentation = async (name, description, code, tags = []) => {
    try {
        const response = await fetch("https://cors-anywhere.herokuapp.com/https://api-inference.huggingface.co/models/distilgpt2", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: generatePrompt(name, description, code, tags),
                parameters: { max_length: 1000 }
            }),
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const data = await response.json();

        console.log(data);
        return data[0]?.generated_text || "**Error:** No se pudo generar la documentación.";
    } catch (error) {
        console.error("Error al generar la documentación:", error);
        //   return "**Error:** No se pudo generar la documentación.";
        console.log("Generating fallback documentation");
        return generateFallbackDocumentation(name, description, code, tags);
    }
};