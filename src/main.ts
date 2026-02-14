import { Plugin, Notice } from 'obsidian';
import { StudyAnalyzer } from './core/studyAnalyzer';




export default class KeywordHighlighterPlugin extends Plugin {

    private analyzer = new StudyAnalyzer();

    private registerAnalyzeCommand() {
        this.addCommand({
            id: 'analyze-note',
            name: 'Analyze Note for Important Content',
            callback: async () => {

                const activeFile = this.app.workspace.getActiveFile();

                if (!activeFile) {
                    new Notice('No active file found!');
                    return;
                }

                const content = await this.app.vault.read(activeFile);

                const highlights = this.analyzer.analyze(content);

                if (highlights.length === 0) {
                    new Notice('No important content detected.');
                    return;
                }

                console.log('Detected highlights:', highlights);
                new Notice(`Detected ${highlights.length} important sections.`);
            }
        });
    }



    private registerNotificationCommand() {

        this.addCommand({
            id: 'show-notification',
            name: 'Show Notification',
            callback: () => {
                new Notice('This is a notification from the Keyword Highlighter Plugin!');
            }
        });

    }

    private registerReloadCommand() {
        this.addCommand({
            id: 'reload-plugin',
            name: 'Reload this plugin',
            callback: async () => {
                const id = this.manifest.id;

                // @ts-ignore (internal API from Obsidian)
                await this.app.plugins.disablePlugin(id);

                // @ts-ignore (internal API from Obsidian)
                await this.app.plugins.enablePlugin(id);
                new Notice('Keyword Highlighter plugin reloaded!');
            }
        });
    }

    async onload() {
        // this is called when the plugin is loaded
        console.log('Loading Keyword Highlighter Plugin');

        this.registerAnalyzeCommand();
        this.registerNotificationCommand();
        this.registerReloadCommand();

    }

    onunload() {
        // this is called when the plugin is unloaded
        console.log('Unloading Keyword Highlighter Plugin');
    }



}