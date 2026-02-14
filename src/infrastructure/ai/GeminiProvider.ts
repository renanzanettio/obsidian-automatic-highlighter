import { AIProvider } from "../../core/interfaces/AIProvider";

export class GeminiProvider implements AIProvider {
  constructor(private apiKey: string) { }

  async generateContent(prompt: string): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error("Resposta do Gemini vazia ou inválida");
    }

    // Limpa crases ou markdown extras
    resultText = resultText.replace(/```json|```/g, '').trim();

    // Só loga para debug
    console.log("Resposta bruta do Gemini:", resultText);

    return resultText; // retorna como string, JSON.parse será feito no Analyzer
  }
}