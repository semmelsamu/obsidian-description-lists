import {
    App,
    PluginSettingTab,
    Setting,
    SettingDefinitionItem,
} from 'obsidian';
import DescriptionListsPlugin from './main';

export interface DescriptionListsSettings {
    mySetting: string;
}

export const DEFAULT_SETTINGS: DescriptionListsSettings = {
    mySetting: 'default',
};

export class DescriptionListsSettingTab extends PluginSettingTab {
    plugin: DescriptionListsPlugin;

    constructor(app: App, plugin: DescriptionListsPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    getSettingDefinitions(): SettingDefinitionItem[] {
        return [
            {
                name: 'Settings #1',
                desc: "It's a secret",
                control: {
                    type: 'text',
                    key: 'mySetting',
                    placeholder: 'Enter your secret',
                },
            },
        ];
    }

    // Fallback for Obsidian versions older than 1.13.0
    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Settings #1')
            .setDesc("It's a secret")
            .addText((text) =>
                text
                    .setPlaceholder('Enter your secret')
                    .setValue(this.plugin.settings.mySetting)
                    .onChange(async (value) => {
                        this.plugin.settings.mySetting = value;
                        await this.plugin.saveSettings();
                    }),
            );
    }
}
