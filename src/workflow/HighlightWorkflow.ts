import { App, Editor } from 'obsidian';
import { HighlightResult } from '../core/interfaces/HighlightResult';

export class HighlightWorkflow {
    constructor(private app: App) {}

    // Adicione highlights como argumento opcional
    run(editor: Editor, highlights: HighlightResult[]) {
    if (!highlights || highlights.length === 0) return;

    // Ordena do maior start para o menor
    const sorted = highlights.sort((a, b) => b.start - a.start);

    let text = editor.getValue();

    sorted.forEach(h => {
        text = text.slice(0, h.start) + `==${h.text}==` + text.slice(h.end);
    });

    editor.setValue(text);
}
}