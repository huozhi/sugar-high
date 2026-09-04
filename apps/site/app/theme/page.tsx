import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import ThemeGuide, { type ThemeOption } from './theme-guide'
import { ReactThemeProvider } from '../components/react-themes'

export default async function ThemePage() {
  const themesDir = join(process.cwd(), 'public', 'themes')
  const catalog = JSON.parse(
    await readFile(join(themesDir, 'index.json'), 'utf8')
  ) as Omit<ThemeOption, 'css'>[]
  const [themes, tailwindRecipe] = await Promise.all([
    Promise.all(catalog.map(async theme => ({
      ...theme,
      css: await readFile(join(themesDir, theme.file), 'utf8'),
    }))),
    readFile(join(themesDir, 'sugar-high.tailwind.css'), 'utf8'),
  ])

  return (
    <>
      {themes.map(theme => (
        <link key={theme.id} rel="stylesheet" href={`/themes/${theme.file}`} />
      ))}
      <ReactThemeProvider>
        <ThemeGuide themes={themes} tailwindRecipe={tailwindRecipe} />
      </ReactThemeProvider>
    </>
  )
}
