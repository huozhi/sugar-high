import { tailwindRecipe } from '../recipes'

export function GET() {
  return new Response(tailwindRecipe, {
    headers: { 'content-type': 'text/css; charset=utf-8' },
  })
}
