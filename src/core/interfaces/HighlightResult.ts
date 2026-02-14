export interface HighlightResult {
  text: string;
  start: number;
  end: number;
  type: string; // "definition", "concept", "important", etc
}