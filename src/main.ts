import { App, Plugin, PluginSettingTab, Setting, Command, MarkdownView } from "obsidian";
import "./styles.css";
import { ClipperData } from "./data";

interface ClipperSettings {
  apiKey: string;
}

const DEFAULT_SETTINGS: ClipperSettings = {
  apiKey: "",
};

export default class ClipperPlugin extends Plugin {
  settings: ClipperSettings;
  data: ClipperData;

  async onload() {
    console.log("loading plugin");

    await this.loadSettings();
    this.data = new ClipperData();

    this.addRibbonIcon("scissors", "JOP Clipper", () => {
      this.clipCurrentPage();
    });

    this.addCommand({
      id: "clip-page",
      name: "Clip Page",
      callback: async () => {
        console.log("clip page command triggered");
        await this.clipCurrentPage();
      },
    });

    this.addCommand({
      id: "clip-text",
      name: "Clip Text",
      callback: async () => {
        console.log("clip text command triggered");
        await this.clipSelection();
      },
    });

    this.addSettingTab(new ClipperSettingTab(this.app, this));
  }

  private async clipCurrentPage() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
      const content = view.getViewData();
      if (content) {
        console.log("현재 페이지 클립 실행:", content);
      }
    }
  }

  private async clipSelection() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (view) {
      const editor = view.editor;
      const selection = editor.getSelection();
      if (selection) {
        console.log("선택된 텍스트:", selection);
      }
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class ClipperSettingTab extends PluginSettingTab {
  plugin: ClipperPlugin;

  constructor(app: App, plugin: ClipperPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "JOP Clipper Settings" });

    new Setting(containerEl)
      .setName("API Key")
      .setDesc("Enter your API key")
      .addText((text) =>
        text
          .setPlaceholder("Enter your API key")
          .setValue(this.plugin.settings.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
