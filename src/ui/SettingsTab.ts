import { App, PluginSettingTab, Setting } from 'obsidian';
import { AutomaticHighlighterSettings } from './main';

export class AutomaticHighlighterSettingsTab extends PluginSettingTab {
    plugin: any;

    constructor(app: App, plugin: any) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Configurações do Automatic Highlighter' });

        new Setting(containerEl)
            .setName('Gemini API Key')
            .setDesc('Digite sua chave da API do Gemini aqui.')
            .addText(text => 
                text
                    .setPlaceholder('Insira sua API key')
                    .setValue(this.plugin.settings.geminiApiKey)
                    .onChange(async (value) => {
                        this.plugin.settings.geminiApiKey = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}