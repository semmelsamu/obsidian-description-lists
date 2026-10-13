import { Plugin } from 'obsidian';
import { processTermLists } from './postprocessor';

export default class DescriptionListsPlugin extends Plugin {
    onload() {
        this.registerMarkdownPostProcessor((el, ctx) =>
            processTermLists(this.app, el, ctx),
        );
    }
}
