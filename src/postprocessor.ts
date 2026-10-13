import {
    App,
    Component,
    MarkdownPostProcessorContext,
    MarkdownRenderChild,
    MarkdownRenderer,
} from 'obsidian';
import { parseTermList, TermEntry } from './parser';

export const LIST_CLASS = 'description-list';

/**
 * Reading view post processor: replaces paragraphs that start with a
 * Typst-style term line (`/ Term: Description`) by a <dl>.
 */
export async function processTermLists(
    app: App,
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext,
): Promise<void> {
    const paragraphs = Array.from(el.children).filter(
        (child): child is HTMLParagraphElement => child.tagName === 'P',
    );
    if (paragraphs.length !== 1) return;
    const paragraph = paragraphs[0];
    if (!paragraph) return;

    const info = ctx.getSectionInfo(el);
    if (!info) return;

    const lines = info.text.split('\n').slice(info.lineStart, info.lineEnd + 1);
    const entries = parseTermList(lines);
    if (!entries) return;

    const dl = createEl('dl', { cls: LIST_CLASS });
    const component = new MarkdownRenderChild(dl);
    ctx.addChild(component);

    for (const entry of entries) {
        await renderEntry(app, dl, entry, ctx.sourcePath, component);
    }
    paragraph.replaceWith(dl);
}

async function renderEntry(
    app: App,
    dl: HTMLElement,
    entry: TermEntry,
    sourcePath: string,
    component: Component,
): Promise<void> {
    const row = dl.createDiv();
    const dt = row.createEl('dt');
    const dd = row.createEl('dd');
    // Wrap the term in <strong> so themes that style bold text
    // (e.g. via `--bold-color`) apply to it as well.
    const term = dt.createEl('strong');
    await renderInline(app, entry.term, term, sourcePath, component);
    await renderInline(app, entry.description, dd, sourcePath, component);
}

/** Renders markdown into `target` and unwraps a single surrounding <p>. */
async function renderInline(
    app: App,
    markdown: string,
    target: HTMLElement,
    sourcePath: string,
    component: Component,
): Promise<void> {
    await MarkdownRenderer.render(app, markdown, target, sourcePath, component);
    const only = target.children.length === 1 ? target.firstElementChild : null;
    if (only && only.tagName === 'P') {
        only.replaceWith(...Array.from(only.childNodes));
    }
}
