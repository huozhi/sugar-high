import { cssRecipe } from '../recipes'

export function GET() {
  return new Response(cssRecipe, {
    headers: { 'content-type': 'text/css; charset=utf-8' },
  })
}
