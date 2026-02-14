export type HighlightType =
    | "title"
    | "definition"
    | "purpose"
    | "principle"
    | "acronym"
    | "comparison"
    | "important"
    | "example"
    | "conclusion"
    | "warning"

export interface HighlightCandidate {
    text: string;
    start: number;
    end: number;
    type: HighlightType;
}

export class StudyAnalyzer {

    analyze(content: string): HighlightCandidate[] {
        const results: HighlightCandidate[] = [];

        const lines = content.split("\n");
        let offset = 0;

        for (const line of lines) {

            let detectedType: HighlightType | null = null;
            let start = offset;
            let end = offset + line.length;

            // PRIORIDADE 1 - TITLE
            if (line.startsWith("### ")) {
                detectedType = "title";
            }

            // PRIORIDADE 2 - PRINCIPLE
            else if (/^\d+\./.test(line.trim())) {
                detectedType = "principle";
            }

            // PRIORIDADE 3 - DEFINITION (PT + EN)
            else if (
                line.includes(" é ") ||
                line.includes(" is ") ||
                line.includes(" refere-se a ") ||
                line.includes(" is defined as ") ||
                line.includes(" consiste em ") ||
                line.includes(" consists of ")
            ) {
                detectedType = "definition";
            }

            // PRIORIDADE 4 - PURPOSE (PT + EN)
            else if (
                line.includes("visa") ||
                line.includes("serve para") ||
                line.includes("tem como objetivo") ||
                line.includes("permite") ||
                line.includes("allows") ||
                line.includes("enables") ||
                line.includes("aims to") ||
                line.includes("is used to")
            ) {
                detectedType = "purpose";
            }

            // PRIORIDADE 5 - EXAMPLE
            else if (
                line.includes("por exemplo") ||
                line.includes("for example") ||
                line.includes("for instance") ||
                line.includes("e.g.")
            ) {
                detectedType = "example";
            }

            // PRIORIDADE 6 - COMPARISON
            else if (
                line.includes("diferente de") ||
                line.includes("similar to") ||
                line.includes("in contrast") ||
                line.includes("por outro lado") ||
                line.includes("on the other hand")
            ) {
                detectedType = "comparison";
            }

            // PRIORIDADE 7 - IMPORTANT
            else if (
                line.includes("importante") ||
                line.includes("fundamental") ||
                line.includes("essential") ||
                line.includes("crucial") ||
                line.includes("key")
            ) {
                detectedType = "important";
            }

            // PRIORIDADE 8 - CONCLUSION
            else if (
                line.includes("em resumo") ||
                line.includes("portanto") ||
                line.includes("therefore") ||
                line.includes("in summary") ||
                line.includes("thus")
            ) {
                detectedType = "conclusion";
            }

            if (detectedType) {
                results.push({
                    text: line,
                    start,
                    end,
                    type: detectedType
                });
            }

            // ACRONYM (separado, porque pode estar dentro de outro tipo)
            const acronymMatch = line.match(/\b[A-Z]{2,}\s*\([^)]+\)/);
            if (acronymMatch) {
                const index = line.indexOf(acronymMatch[0]);

                results.push({
                    text: acronymMatch[0],
                    start: offset + index,
                    end: offset + index + acronymMatch[0].length,
                    type: "acronym"
                });
            }

            offset += line.length + 1;
        }

        return results;
    }
}