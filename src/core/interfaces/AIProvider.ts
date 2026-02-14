export interface AIProvider {
  generateContent(prompt: string): Promise<string>;
}