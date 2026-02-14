"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => AutomaticHighlighter
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/infrastructure/ai/GeminiProvider.ts
var GeminiProvider = class {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  async generateContent(prompt) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await response.json();
    let resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) {
      throw new Error("Resposta do Gemini vazia ou inv\xE1lida");
    }
    resultText = resultText.replace(/```json|```/g, "").trim();
    console.log("Resposta bruta do Gemini:", resultText);
    return resultText;
  }
};

// src/core/services/GeminiAnalyzer.ts
var GeminiAnalyzer = class {
  constructor(aiProvider) {
    this.aiProvider = aiProvider;
  }
  async analyze(noteContent) {
    const prompt = this.buildPrompt(noteContent);
    const raw = await this.aiProvider.generateContent(prompt);
    let cleaned = raw.replace(/```json|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON inv\xE1lido recebido do Gemini:", cleaned);
      throw new Error(`Resposta da IA n\xE3o \xE9 JSON v\xE1lido. Conte\xFAdo retornado: ${cleaned}`);
    }
    return this.validateAndFix(parsed, noteContent);
  }
  buildPrompt(noteContent) {
    return `
Voc\xEA \xE9 um assistente que extrai **apenas trechos curtos e significativos** de uma nota, \xFAteis para estudo (tipo flashcards).

Regras obrigat\xF3rias:
1. Retorne **somente JSON v\xE1lido**, sem markdown, sem crases, sem t\xEDtulos, sem explica\xE7\xF5es.
2. Cada item do array deve conter:
   - "text": o trecho exato do texto
   - "type": "definition", "concept" ou "important"
   - "start": \xEDndice inicial
   - "end": \xEDndice final
3. Ignore palavras isoladas ou frases triviais; pegue somente trechos relevantes e explicativos.
4. **N\xC3O use markdown, crases, ou qualquer formata\xE7\xE3o**, apenas JSON puro.
5. Retorne **SOMENTE um array JSON v\xE1lido**. Nada mais.

Exemplo de sa\xEDda v\xE1lida:
[
  { "text": "O \xE1tomo \xE9 a unidade b\xE1sica da mat\xE9ria.", "type": "definition", "start": 0, "end": 38 },
  { "text": "A fotoss\xEDntese converte luz em energia.", "type": "concept", "start": 50, "end": 90 }
]

Texto da nota:
"""
${noteContent}
"""
`;
  }
  validateAndFix(results, content) {
    return results.map((item) => {
      const start = content.indexOf(item.text);
      if (start === -1) return null;
      return {
        text: item.text,
        type: item.type,
        start,
        end: start + item.text.length
      };
    }).filter(Boolean);
  }
};

// src/workflow/HighlightWorkflow.ts
var HighlightWorkflow = class {
  constructor(app) {
    this.app = app;
  }
  // Adicione highlights como argumento opcional
  run(editor, highlights) {
    if (!highlights || highlights.length === 0) return;
    const sorted = highlights.sort((a, b) => b.start - a.start);
    let text = editor.getValue();
    sorted.forEach((h) => {
      text = text.slice(0, h.start) + `==${h.text}==` + text.slice(h.end);
    });
    editor.setValue(text);
  }
};

// src/ui/SettingsTab.ts
var import_obsidian = require("obsidian");
var AutomaticHighlighterSettingsTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Configura\xE7\xF5es do Automatic Highlighter" });
    new import_obsidian.Setting(containerEl).setName("Gemini API Key").setDesc("Digite sua chave da API do Gemini aqui.").addText(
      (text) => text.setPlaceholder("Insira sua API key").setValue(this.plugin.settings.geminiApiKey).onChange(async (value) => {
        this.plugin.settings.geminiApiKey = value;
        await this.plugin.saveSettings();
      })
    );
  }
};

// src/main.ts
var DEFAULT_SETTINGS = {
  geminiApiKey: ""
};
var AutomaticHighlighter = class extends import_obsidian2.Plugin {
  async onload() {
    console.log("Loading Automatic Highlighter Plugin");
    await this.loadSettings();
    this.addSettingTab(new AutomaticHighlighterSettingsTab(this.app, this));
    this.registerAnalyzeCommand();
    this.registerNotificationCommand();
    this.registerReloadCommand();
  }
  onunload() {
    console.log("Unloading Automatic Highlighter Plugin");
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
  registerAnalyzeCommand() {
    this.addCommand({
      id: "analyze-and-highlight",
      name: "Analyze and Suggest Highlights",
      callback: async () => await this.executeWorkflow()
    });
  }
  registerNotificationCommand() {
    this.addCommand({
      id: "show-notification",
      name: "Show Notification",
      callback: () => {
        new import_obsidian2.Notice("This is a notification from the Automatic Highlighter Plugin!");
      }
    });
  }
  registerReloadCommand() {
    this.addCommand({
      id: "reload-plugin",
      name: "Reload this plugin",
      callback: async () => {
        const id = this.manifest.id;
        await this.app.plugins.disablePlugin(id);
        await this.app.plugins.enablePlugin(id);
        new import_obsidian2.Notice("Automatic Highlighter plugin reloaded!");
      }
    });
  }
  // ===============================
  // Fluxo principal
  // ===============================
  async executeWorkflow() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
    if (!view) return;
    const editor = view.editor;
    if (!editor) return;
    const content = editor.getValue();
    const provider = new GeminiProvider(this.settings.geminiApiKey);
    const analyzer = new GeminiAnalyzer(provider);
    let highlights;
    try {
      highlights = await analyzer.analyze(content);
    } catch (err) {
      console.error("Erro ao analisar nota:", err);
      new import_obsidian2.Notice("Erro ao analisar nota. Veja console para detalhes.");
      return;
    }
    if (!highlights || highlights.length === 0) {
      new import_obsidian2.Notice("Nenhum destaque encontrado.");
      return;
    }
    const workflow = new HighlightWorkflow(this.app);
    workflow.run(editor, highlights);
    new import_obsidian2.Notice(`Applied ${highlights.length} highlights!`);
  }
};
//# sourceMappingURL=main.js.map
