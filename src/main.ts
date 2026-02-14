import { Plugin, Notice, MarkdownView, Editor } from 'obsidian';
import { GeminiProvider } from "./infrastructure/ai/GeminiProvider";
import { GeminiAnalyzer } from "./core/services/GeminiAnalyzer";
import { HighlightWorkflow } from './workflow/HighlightWorkflow';
import { HighlightResult } from './core/interfaces/HighlightResult';
import { AutomaticHighlighterSettingsTab } from './ui/SettingsTab';

interface AutomaticHighlighterSettings {
    geminiApiKey: string;
}

const DEFAULT_SETTINGS: AutomaticHighlighterSettings = {
    geminiApiKey: ""
};

export default class AutomaticHighlighter extends Plugin {
    
    settings!: AutomaticHighlighterSettings;

    async onload() {
        console.log('Loading Automatic Highlighter Plugin');

        // Carrega configurações salvas
        await this.loadSettings();
        this.addSettingTab(new AutomaticHighlighterSettingsTab(this.app, this));

        // Registra comandos
        this.registerAnalyzeCommand();
        this.registerNotificationCommand();
        this.registerReloadCommand();
    }

    onunload() {
        console.log('Unloading Automatic Highlighter Plugin');
    }

    // ===============================
    // Settings
    // ===============================
    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    // ===============================
    // Comandos
    // ===============================
    private registerAnalyzeCommand() {
        this.addCommand({
            id: "analyze-and-highlight",
            name: "Analyze and Suggest Highlights",
            callback: async () => await this.executeWorkflow()
        });
    }

    private registerNotificationCommand() {
        this.addCommand({
            id: 'show-notification',
            name: 'Show Notification',
            callback: () => {
                new Notice('This is a notification from the Automatic Highlighter Plugin!');
            }
        });
    }

    private registerReloadCommand() {
        this.addCommand({
            id: 'reload-plugin',
            name: 'Reload this plugin',
            callback: async () => {
                const id = this.manifest.id;
                // @ts-ignore
                await this.app.plugins.disablePlugin(id);
                // @ts-ignore
                await this.app.plugins.enablePlugin(id);
                new Notice('Automatic Highlighter plugin reloaded!');
            }
        });
    }

    // ===============================
    // Fluxo principal
    // ===============================
    private async executeWorkflow() {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) return;

        const editor: Editor = view.editor;
        if (!editor) return;

        const content = editor.getValue();

        // Criar provider com API Key do usuário
        const provider = new GeminiProvider(this.settings.geminiApiKey);

        // Criar analyzer
        const analyzer = new GeminiAnalyzer(provider);

        // Executar análise
        let highlights: HighlightResult[];
        try {
            highlights = await analyzer.analyze(content);
        } catch (err) {
            console.error("Erro ao analisar nota:", err);
            new Notice("Erro ao analisar nota. Veja console para detalhes.");
            return;
        }

        if (!highlights || highlights.length === 0) {
            new Notice("Nenhum destaque encontrado.");
            return;
        }

        // Aplicar highlights usando o workflow existente
        const workflow = new HighlightWorkflow(this.app);
        workflow.run(editor, highlights);

        new Notice(`Applied ${highlights.length} highlights!`);
    }
}