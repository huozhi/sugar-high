/**
 * Snippets aligned with apps/docs/app/carousel.tsx showcase cards (tighter whitespace).
 */
export const LIB_RS = `use std::fmt::Display;

/// Build a short Cartesian label for two displayable values.
pub fn label<T: Display>(x: T, y: T) -> String {
    // format pair
    format!("({}, {})", x, y)
}

pub fn labels<I, T>(pairs: I) -> Vec<String>
where
    I: IntoIterator<Item = (T, T)>,
    T: Display,
{
    pairs.into_iter().map(|(a, b)| label(a, b)).collect()
}

fn main() {
    let pts = vec![(1u32, 2u32), (3, 4)];
    for line in labels(pts) {
        println!("point {line}");
    }
    println!("{}", label("x", "y"));
}`

export const MAIN_PY = `def greet(names):
    # one name per line
    for n in names:
        print("hello, " + n)

def shout(msg: str, times: int = 2) -> None:
    """Uppercase a message a few times."""
    for _ in range(max(1, times)):
        print(msg.upper())

def chunk(items, size):
    # simple batches for display
    for i in range(0, len(items), size):
        yield items[i : i + size]

if __name__ == "__main__":
    greet(["ada", "linus"])
    shout("sugar-high")
    print(list(chunk([1, 2, 3, 4, 5], 2)))`

export const THEME_CSS = `:root {
  --accent: #2d5e9d;
  --surface: #f6f8fa;
  --text: #24292f;
  --radius: 8px;
}
*, *::before, *::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  color: var(--text);
  background: var(--surface);
}
@media (prefers-color-scheme: dark) {
  :root {
    --surface: hsl(220 14% 12%);
    --text: #e6edf3;
  }
  .card {
    background: color-mix(in srgb, var(--surface) 92%, #000);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.stack-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}`
