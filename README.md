# Description Lists

Renders [Typst-style term lists](https://typst.app/docs/reference/model/terms/) as HTML description lists (`<dl>`) in Obsidian's reading view.

## Syntax

Start a paragraph with `/ `, followed by the term, a colon and the description:

```markdown
/ Apple: A red fruit that grows on trees.
/ Pear: A green fruit,
described across multiple lines.
/ Cherry: A small **red** fruit, see [[Fruits]].
```

Rules:

- The marker is a slash followed by a space at the start of the line.
- The first colon separates term and description. Both must be non-empty.
- A paragraph becomes a term list only if its first line is a valid term line.
- Any following line that is not a valid term line is appended to the previous description.
- Each paragraph is its own list. Term and description support inline markdown.

Only reading view is supported. The editor shows the plain syntax.

## Styling

The list is rendered as `<dl class="description-list">` with one `<div>` per entry containing `<dt>` and `<dd>`. The default style mimics Typst: bold term, description on the same line, hanging indent. The colon after the term is added via `dt::after`.

Override it with a CSS snippet, for example to put descriptions on their own line:

```css
.description-list dt,
.description-list dd {
    display: block;
}

.description-list dt::after {
    content: '';
}
```

## Development

```bash
npm install
npm run dev     # watch mode
npm run build   # production build
npm run lint
```

Copy `main.js`, `manifest.json` and `styles.css` to `<Vault>/.obsidian/plugins/description-lists/` and enable the plugin under **Settings → Community plugins**.
