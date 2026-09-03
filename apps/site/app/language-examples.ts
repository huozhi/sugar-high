import type { LanguageName } from 'sugar-high'

export const LANGUAGE_EXAMPLES: Record<LanguageName, string> = {
  javascript: `export default function App() {
  return (
    <>
      <h1 id="title">
        Hello
        <span> world</span>
      </h1>
      <div style={styles.bar} />
    </>
  )
}

`,
  typescript: `type User = { name: string; active: boolean }

const user: User = {
  name: 'Ada', active: true
}
`,
  css: `.card {
  border-radius: 1rem;
  color: rebeccapurple;
}
`,
  python: `def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("Ada"))
`,
  c: `#include <stdio.h>
int main(void) {
  printf("Hello, world!\\n");
  return 0;
}
`,
  go: `package main
import "fmt"

func main() {
  fmt.Println("Hello, world!")
}
`,
  java: `class Greeter {
  public static void main(String[] args) {
    System.out.println("Hello, world!");
  }
}
`,
  rust: `fn main() {
    let language = "Rust";
    println!("Hello, {language}!");
}
`,
  json: `{
  "name": "sugar-high",
  "languages": 29
}
`,
  diff: `-const greeting = "Hello"
+const greeting = "Hello, world!"
`,
  shell: `#!/usr/bin/env bash
name="world"
echo "Hello, $name!"
`,
  cpp: `#include <iostream>
int main() {
  std::cout << "Hello, world!\\n";
  return 0;
}
`,
  csharp: `var names = new[] { "Ada", "Grace" };
foreach (var name in names) {
  Console.WriteLine($"Hello, {name}!");
}
`,
  sql: `SELECT name, created_at
FROM users
WHERE active = true
ORDER BY created_at DESC;
`,
  html: `<article class="card">
  <h1>Hello, world!</h1>
  <p>Highlighted with Sugar High.</p>
</article>
`,
  yaml: `name: sugar-high
languages: 29
features:
  - lightweight
  - zero-dependency
`,
  markdown: `# Sugar High

Lightweight **syntax highlighting** for the web.

- Zero dependencies
- Multiple languages
`,
  plaintext: `Sugar High
Lightweight syntax highlighting for the web.
No grammar setup required.
`,
  ruby: `def greet(name)
  puts "Hello, #{name}!"
end
greet("Ada")
`,
  kotlin: `data class User(val name: String)
fun greet(user: User) {
  println("Hello, $user!")
}
`,
  swift: `let name = "Ada"
let active = true

if active {
  print("Hello, \\(name)!")
}
`,
  php: `<?php
function greet(string $name): string {
    return "Hello, $name!";
}
`,
  toml: `[package]
name = "sugar-high"
version = "2.3.0"
[features]
languages = true
`,
  powershell: `$name = "world"
function Write-Greeting {
  Write-Host "Hello, $name!"
}
`,
  dockerfile: `FROM node:24-alpine
WORKDIR /app
COPY . .
RUN pnpm install
CMD ["pnpm", "start"]
`,
  graphql: `query CurrentUser {
  viewer { id name }
}
`,
  hcl: `resource "aws_s3_bucket" "assets" {
  bucket = "sugar-high-assets"
  force_destroy = true
}
`,
  zig: `const std = @import("std");
pub fn main() void {
    std.debug.print("Hello, world!\\n", .{});
}
`,
  lua: `local function greet(name)
  return "Hello, " .. name .. "!"
end
print(greet("world"))
`,
}
