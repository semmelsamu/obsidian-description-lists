export interface TermEntry {
    term: string;
    description: string;
}

const MARKER = '/ ';

/**
 * Parses a single line as a Typst-style term line (`/ Term: Description`).
 * Returns null when the line is not a valid term line: missing marker,
 * missing colon, empty term or empty description.
 */
export function parseTermLine(line: string): TermEntry | null {
    if (!line.startsWith(MARKER)) return null;
    const body = line.slice(MARKER.length);
    const colon = body.indexOf(':');
    if (colon === -1) return null;
    const term = body.slice(0, colon).trim();
    const description = body.slice(colon + 1).trim();
    if (term === '' || description === '') return null;
    return { term, description };
}

/**
 * Parses a paragraph (lines of raw markdown) as a term list.
 * The first line must be a valid term line, otherwise null is returned.
 * Every following line that is not a valid term line is appended to the
 * description of the previous entry.
 */
export function parseTermList(lines: string[]): TermEntry[] | null {
    if (lines.length === 0) return null;
    const first = parseTermLine(lines[0] ?? '');
    if (!first) return null;

    const entries: TermEntry[] = [first];
    for (const line of lines.slice(1)) {
        const entry = parseTermLine(line);
        if (entry) {
            entries.push(entry);
        } else {
            const last = entries[entries.length - 1];
            if (last) last.description += '\n' + line.trim();
        }
    }
    return entries;
}
