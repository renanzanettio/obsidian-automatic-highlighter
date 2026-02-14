import { AIProvider } from "../interfaces/AIProvider";
import { NoteAnalyzer } from "../interfaces/NoteAnalyzer";
import { HighlightResult } from "../interfaces/HighlightResult";

export class GeminiAnalyzer implements NoteAnalyzer {
  constructor(private aiProvider: AIProvider) { }

  async analyze(noteContent: string): Promise<HighlightResult[]> {
    const prompt = this.buildPrompt(noteContent);
    const raw = await this.aiProvider.generateContent(prompt);

    // Limpa crases, markdown, e espaços extras
    let cleaned = raw.replace(/```json|```/g, '').trim();

    let parsed: { text: string; type: string }[];

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON inválido recebido do Gemini:", cleaned);
      throw new Error(`Resposta da IA não é JSON válido. Conteúdo retornado: ${cleaned}`);
    }

    // Converte para o formato completo com índices
    return this.validateAndFix(parsed, noteContent);
  }

  private buildPrompt(noteContent: string): string {
    return `
Você é um assistente que extrai **apenas trechos curtos e significativos** de uma nota, úteis para estudo (tipo flashcards).

Regras obrigatórias:
1. Retorne **somente JSON válido**, sem markdown, sem crases, sem títulos, sem explicações.
2. Cada item do array deve conter:
   - "text": o trecho exato do texto
   - "type": "definition", "concept" ou "important"
   - "start": índice inicial
   - "end": índice final
3. Ignore palavras isoladas ou frases triviais; pegue somente trechos relevantes e explicativos.
4. **NÃO use markdown, crases, ou qualquer formatação**, apenas JSON puro.
5. Retorne **SOMENTE um array JSON válido**. Nada mais.

Exemplo de saída válida:
[
  { "text": "O átomo é a unidade básica da matéria.", "type": "definition", "start": 0, "end": 38 },
  { "text": "A fotossíntese converte luz em energia.", "type": "concept", "start": 50, "end": 90 }
]

Texto da nota:
"""
${noteContent}
"""
`;
  }

  private validateAndFix(
    results: { text: string; type: string }[],
    content: string
  ): HighlightResult[] {
    return results
      .map(item => {
        const start = content.indexOf(item.text);
        if (start === -1) return null;

        return {
          text: item.text,
          type: item.type,
          start,
          end: start + item.text.length
        };
      })
      .filter(Boolean) as HighlightResult[];
  }
}