import { Plugin, Notice } from 'obsidian';



export default class KeywordHighlighterPlugin extends Plugin {

    private registerExtractKeywordsCommand() {
        this.addCommand({
            id: 'extract-keywords',
            name: 'Extract Keywords',
            callback: () => {
                // this is where you would implement the keyword extraction logic
                console.log('Extracting keywords from the current note...');
            }
        });
    }

    private RegisterNotificationCommand(){

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

        this.registerExtractKeywordsCommand();
        this.RegisterNotificationCommand();
        this.registerReloadCommand();

    }

    onunload() {
        // this is called when the plugin is unloaded
        console.log('Unloading Keyword Highlighter Plugin');
    }



}