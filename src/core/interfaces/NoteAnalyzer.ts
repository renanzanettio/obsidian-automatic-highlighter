import { HighlightResult } from "./HighlightResult";

export interface NoteAnalyzer {
  analyze(noteContent: string): Promise<HighlightResult[]>;
}