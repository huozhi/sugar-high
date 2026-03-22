/**
 * sugar-high joins `<span class="sh__line">` with `\n` in the HTML string.
 * Inside `<pre>`, those newlines are preserved and look like an extra blank line
 * after every row — strip them between adjacent line spans.
 */
export function compactHighlightedHtml(html: string): string {
  return html.replace(/\n(?=<span class="sh__line")/g, '')
}
