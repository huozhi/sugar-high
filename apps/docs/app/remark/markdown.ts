import { remark } from 'remark'
import { highlight } from 'remark-sugar-high'
import html from 'remark-html'
import gfm from 'remark-gfm'

export async function renderMarkdown(input: string) {
  const markdown = await remark()
    .use(gfm)
    .use(highlight)
    // @ts-expect-error ignore ts checking
    .use(html, { sanitize: false })
    .process(input)

  return markdown.toString()
}
