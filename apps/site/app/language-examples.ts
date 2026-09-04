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
  css: `/* A responsive project card */
:root {
  --accent: #f47067;
  --surface: #f6f6f6;
}

.card {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--surface);
  color: #354150;
}

.card a:hover {
  color: var(--accent);
  text-decoration: underline;
}

@media (min-width: 720px) {
  .card {
    grid-template-columns: 1fr 2fr;
    align-items: start;
  }
}
`,
  python: `from dataclasses import dataclass

@dataclass
class Project:
    name: str
    stars: int
    active: bool = True


def popular_projects(projects: list[Project]) -> list[str]:
    # Keep active projects with at least 100 stars.
    return [
        f"{project.name}: {project.stars:,} stars"
        for project in projects
        if project.active and project.stars >= 100
    ]


projects = [
    Project("Sugar High", 1200),
    Project("Code Garden", 480),
    Project("Old Notes", 250, active=False),
]

for summary in popular_projects(projects):
    print(summary)
`,
  c: `#include <stdbool.h>
#include <stdio.h>

typedef struct {
    const char *name;
    int stars;
    bool active;
} Project;

int main(void) {
    const Project projects[] = {
        {"Sugar High", 1200, true},
        {"Code Garden", 480, true},
        {"Old Notes", 250, false},
    };
    const size_t count = sizeof projects / sizeof projects[0];

    // Print the projects that are still maintained.
    for (size_t i = 0; i < count; ++i) {
        if (!projects[i].active) continue;
        printf("%s: %d stars\\n", projects[i].name, projects[i].stars);
    }

    return 0;
}
`,
  go: `package main

import "fmt"

type Project struct {
    Name   string
    Stars  int
    Active bool
}

func main() {
    projects := []Project{
        {Name: "Sugar High", Stars: 1200, Active: true},
        {Name: "Code Garden", Stars: 480, Active: true},
        {Name: "Old Notes", Stars: 250, Active: false},
    }

    // Skip archived projects.
    total := 0
    for _, project := range projects {
        if !project.Active {
            continue
        }
        total += project.Stars
        fmt.Printf("%s: %d stars\\n", project.Name, project.Stars)
    }
    fmt.Printf("Total: %d\\n", total)
}
`,
  java: `import java.util.List;

public class ProjectFeed {
    record Project(String name, int stars, boolean active) {}

    public static void main(String[] args) {
        var projects = List.of(
            new Project("Sugar High", 1200, true),
            new Project("Code Garden", 480, true),
            new Project("Old Notes", 250, false)
        );

        // Keep the active projects in the feed.
        var featured = projects.stream()
            .filter(Project::active)
            .filter(project -> project.stars() >= 100)
            .toList();

        for (var project : featured) {
            System.out.printf("%s: %d stars%n",
                project.name(), project.stars());
        }
        System.out.println("Featured: " + featured.size());
    }
}
`,
  rust: `struct Project {
    name: &'static str,
    stars: u32,
    active: bool,
}

fn main() {
    let projects = [
        Project { name: "Sugar High", stars: 1200, active: true },
        Project { name: "Code Garden", stars: 480, active: true },
        Project { name: "Old Notes", stars: 250, active: false },
    ];

    // Borrow each project without consuming the collection.
    let featured: Vec<_> = projects
        .iter()
        .filter(|project| project.active)
        .collect();

    for project in &featured {
        println!("{}: {} stars", project.name, project.stars);
    }

    let total: u32 = featured.iter().map(|p| p.stars).sum();
    println!("Total stars: {total}");
}
`,
  json: `{
  "name": "project-gallery",
  "private": true,
  "theme": "taffy",
  "editor": {
    "language": "typescript",
    "lineNumbers": true,
    "fontSize": 14,
    "highlightLines": [1, [5, 8]]
  },
  "projects": [
    {
      "name": "Sugar High",
      "stars": 1200,
      "tags": ["syntax", "javascript"]
    },
    {
      "name": "Code Garden",
      "stars": 480,
      "tags": ["editor", "react"]
    }
  ],
  "archivedAt": null
}
`,
  diff: `diff --git a/src/projects.js b/src/projects.js
--- a/src/projects.js
+++ b/src/projects.js
@@ -1,9 +1,15 @@
 export function getFeatured(projects) {
-  return projects;
+  return projects
+    .filter(project => project.active)
+    .sort((a, b) => b.stars - a.stars)
+    .slice(0, 3);
 }
\u0020
 export function formatProject(project) {
-  return project.name;
+  const stars = project.stars.toLocaleString();
+  return \`\${project.name}: \${stars} stars\`;
 }
\u0020
-export const theme = "default";
+export const theme = "taffy";
+export const options = {
+  lineNumbers: true,
+};
`,
  shell: `#!/usr/bin/env bash
set -euo pipefail

# Summarize source files without modifying them.
source_dir="\${1:-src}"
extensions=(js ts tsx)
total=0

if [[ ! -d "$source_dir" ]]; then
  printf 'Directory not found: %s\\n' "$source_dir" >&2
  exit 1
fi

for extension in "\${extensions[@]}"; do
  count=0
  while IFS= read -r -d '' file; do
    printf '  %s\\n' "$file"
    count=$((count + 1))
  done < <(find "$source_dir" -type f -name "*.$extension" -print0)

  printf '%s files: %d\\n' "$extension" "$count"
  total=$((total + count))
done

printf 'Total source files: %d\\n' "$total"
`,
  cpp: `#include <iostream>
#include <string>
#include <vector>

struct Project {
    std::string name;
    int stars;
    bool active;
};

int main() {
    const std::vector<Project> projects = {
        {"Sugar High", 1200, true},
        {"Code Garden", 480, true},
        {"Old Notes", 250, false},
    };

    // References avoid copying each project.
    int total = 0;
    for (const auto& project : projects) {
        if (!project.active) continue;
        total += project.stars;
        std::cout << project.name << ": " << project.stars << '\\n';
    }
    std::cout << "Total stars: " << total << '\\n';
    return 0;
}
`,
  csharp: `using System;
using System.Linq;

var projects = new[]
{
    new Project("Sugar High", 1200, true),
    new Project("Code Garden", 480, true),
    new Project("Old Notes", 250, false),
};

// Build a ranked feed of active projects.
var featured = projects
    .Where(project => project.Active)
    .OrderByDescending(project => project.Stars)
    .Take(3)
    .ToArray();

foreach (var project in featured)
{
    Console.WriteLine($"{project.Name}: {project.Stars:N0} stars");
}

Console.WriteLine($"Featured projects: {featured.Length}");

record Project(string Name, int Stars, bool Active);
`,
  sql: `-- Rank active projects by recent activity.
WITH recent_stars AS (
  SELECT
    project_id,
    COUNT(*) AS star_count
  FROM stars
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY project_id
)
SELECT
  projects.name,
  owners.username AS owner,
  COALESCE(recent_stars.star_count, 0) AS recent_stars,
  CASE
    WHEN recent_stars.star_count >= 100 THEN 'trending'
    ELSE 'discover'
  END AS category
FROM projects
JOIN users AS owners ON owners.id = projects.owner_id
LEFT JOIN recent_stars ON recent_stars.project_id = projects.id
WHERE projects.archived_at IS NULL
ORDER BY recent_stars DESC, projects.name ASC
LIMIT 10;
`,
  html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Project Gallery</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main>
      <header>
        <h1>Small projects, bright ideas</h1>
        <p>A collection of tools for the web.</p>
      </header>

      <!-- Each card links to a project. -->
      <article class="card" data-featured="true">
        <h2><a href="/projects/sugar-high">Sugar High</a></h2>
        <p>Lightweight syntax highlighting.</p>
        <ul aria-label="Project tags">
          <li>JavaScript</li>
          <li>Zero dependencies</li>
        </ul>
      </article>
    </main>
  </body>
</html>
`,
  yaml: `# Configuration for the project gallery.
name: project-gallery
version: 1

defaults: &defaults
  theme: taffy
  line_numbers: true
  font_size: 14

previews:
  - name: javascript
    <<: *defaults
    source: examples/greeting.js
  - name: python
    <<: *defaults
    source: examples/greeting.py

navigation:
  title: Explore projects
  links:
    - label: Documentation
      href: /docs
    - label: Examples
      href: /examples

summary: |
  Small tools for expressive interfaces.
  Pick a language to explore its syntax.
`,
  markdown: `# Project Gallery

Small tools for **expressive interfaces** and readable code.

## Featured projects

| Project | Language | Stars |
| --- | --- | ---: |
| Sugar High | JavaScript | 1,200 |
| Code Garden | TypeScript | 480 |

### Getting started

1. Choose a project from the gallery.
2. Read its [documentation](/docs).
3. Try the example below.

\`\`\`javascript
const message = "Small code, bright ideas"
console.log(message)
\`\`\`

> Keep the interface simple and let the code speak.

- [x] Browse projects
- [x] Preview themes
- [ ] Share a favorite
`,
  plaintext: `PROJECT GALLERY
===============

Small tools for expressive interfaces.

Featured projects
-----------------
Sugar High     JavaScript     1,200 stars
Code Garden    TypeScript       480 stars
Paper Trail    Python           320 stars

Preview settings
----------------
Theme:         Taffy
Line numbers:  On
Font size:     14 px

Notes
-----
This sample is intentionally plain text.
Symbols such as <, >, and & remain readable.
No keywords or strings receive special treatment.

Choose another language to compare highlighting.
`,
  ruby: `Project = Struct.new(:name, :stars, :active, keyword_init: true)

projects = [
  Project.new(name: "Sugar High", stars: 1200, active: true),
  Project.new(name: "Code Garden", stars: 480, active: true),
  Project.new(name: "Old Notes", stars: 250, active: false)
]

def featured_projects(projects, minimum: 100)
  projects
    .select { |project| project.active && project.stars >= minimum }
    .sort_by { |project| -project.stars }
end

# Keyword arguments make the filter easy to customize.
featured = featured_projects(projects, minimum: 200)

featured.each_with_index do |project, index|
  puts "#{index + 1}. #{project.name}: #{project.stars} stars"
end

total = featured.sum(&:stars)
puts "Featured projects: #{featured.length}"
puts "Total stars: #{total}"
`,
  kotlin: `data class Project(
    val name: String,
    val stars: Int,
    val active: Boolean = true,
)

fun main() {
    val projects = listOf(
        Project("Sugar High", 1200),
        Project("Code Garden", 480),
        Project("Old Notes", 250, active = false),
    )

    // Collection operations leave the original list unchanged.
    val featured = projects
        .filter { it.active && it.stars >= 100 }
        .sortedByDescending { it.stars }

    featured.forEachIndexed { index, project ->
        println("\${index + 1}. \${project.name}: \${project.stars} stars")
    }

    val total = featured.sumOf { it.stars }
    println("Total stars: $total")
}
`,
  swift: `struct Project {
    let name: String
    let stars: Int
    var active = true
}

let projects = [
    Project(name: "Sugar High", stars: 1200),
    Project(name: "Code Garden", stars: 480),
    Project(name: "Old Notes", stars: 250, active: false),
]

// Filter and rank the projects for a small feed.
let featured = projects
    .filter { $0.active && $0.stars >= 100 }
    .sorted { $0.stars > $1.stars }

for (index, project) in featured.enumerated() {
    print("\\(index + 1). \\(project.name): \\(project.stars) stars")
}

let total = featured.reduce(0) { sum, project in
    sum + project.stars
}
print("Total stars: \\(total)")
`,
  php: `<?php

declare(strict_types=1);

$projects = [
    ['name' => 'Sugar High', 'stars' => 1200, 'active' => true],
    ['name' => 'Code Garden', 'stars' => 480, 'active' => true],
    ['name' => 'Old Notes', 'stars' => 250, 'active' => false],
];

function featuredProjects(array $projects, int $minimum = 100): array
{
    return array_values(array_filter(
        $projects,
        fn (array $project): bool =>
            $project['active'] && $project['stars'] >= $minimum
    ));
}

// Escape names before rendering them into a page.
foreach (featuredProjects($projects) as $project) {
    $name = htmlspecialchars($project['name'], ENT_QUOTES, 'UTF-8');
    $stars = number_format($project['stars']);
    echo "<p>{$name}: {$stars} stars</p>";
}
`,
  toml: `# Project gallery settings
[site]
title = "Project Gallery"
description = "Small tools for expressive interfaces"
base_url = "https://example.com"

[editor]
theme = "taffy"
font_size = 14
line_numbers = true
languages = ["javascript", "typescript", "python"]

[editor.layout]
padding = "1rem"
max_height = 520
wrap_lines = true

[[projects]]
name = "Sugar High"
stars = 1200
active = true

[[projects]]
name = "Code Garden"
stars = 480
active = true
`,
  powershell: `param(
    [string]$SourceDirectory = "src",
    [string[]]$Extensions = @(".js", ".ts", ".tsx")
)

$ErrorActionPreference = "Stop"

function Get-SourceSummary {
    param([string]$Directory)

    # Report matching files without changing them.
    Get-ChildItem -Path $Directory -Recurse -File |
        Where-Object { $_.Extension -in $Extensions } |
        Select-Object Name, Extension, Length
}

if (-not (Test-Path -LiteralPath $SourceDirectory)) {
    throw "Directory not found: $SourceDirectory"
}

$files = @(Get-SourceSummary -Directory $SourceDirectory)
$files | Sort-Object Name | Format-Table -AutoSize

$totalBytes = ($files | Measure-Object Length -Sum).Sum
Write-Host "Source files: $($files.Count)"
Write-Host "Total bytes: $totalBytes"
`,
  dockerfile: `# Build the site in a separate stage.
FROM node:24-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Serve static output from a small runtime image.
FROM nginx:alpine AS runtime

LABEL org.opencontainers.image.title="Project Gallery"
LABEL org.opencontainers.image.description="Static project previews"

COPY --from=builder /app/dist /usr/share/nginx/html

# Check that the server responds before routing traffic.
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget -q -O /dev/null http://localhost/ || exit 1

EXPOSE 80
STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
`,
  graphql: `# Fetch a small feed with reusable project fields.
query FeaturedProjects($limit: Int! = 3, $includeOwner: Boolean! = true) {
  projects(first: $limit, active: true) {
    nodes {
      ...ProjectSummary
      owner @include(if: $includeOwner) {
        id
        username
        avatarUrl
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

fragment ProjectSummary on Project {
  id
  name
  description
  stars
  languages {
    name
    color
  }
}
`,
  hcl: `# A local Terraform example; no cloud account is needed.
terraform {
  required_version = ">= 1.4.0"
}

variable "projects" {
  type = map(number)
  default = {
    "sugar-high"  = 1200
    "code-garden" = 480
  }
}

locals {
  featured = {
    for name, stars in var.projects : name => stars
    if stars >= 100
  }
}

resource "terraform_data" "project" {
  for_each = local.featured
  input = { name = each.key, stars = each.value }
}

output "featured_names" {
  value = sort(keys(local.featured))
}
`,
  zig: `const std = @import("std");

const Project = struct {
    name: []const u8,
    stars: u32,
    active: bool = true,
};

pub fn main() void {
    const projects = [_]Project{
        .{ .name = "Sugar High", .stars = 1200 },
        .{ .name = "Code Garden", .stars = 480 },
        .{ .name = "Old Notes", .stars = 250, .active = false },
    };

    // Iterate over the active projects without allocating.
    var total: u32 = 0;
    for (projects) |project| {
        if (!project.active) continue;
        total += project.stars;
        std.debug.print("{s}: {d} stars\\n", .{
            project.name,
            project.stars,
        });
    }
    std.debug.print("Total stars: {d}\\n", .{total});
}
`,
  lua: `local projects = {
  { name = "Sugar High", stars = 1200, active = true },
  { name = "Code Garden", stars = 480, active = true },
  { name = "Old Notes", stars = 250, active = false },
}

local function featured_projects(items)
  local featured = {}
  for _, project in ipairs(items) do
    if project.active and project.stars >= 100 then
      table.insert(featured, project)
    end
  end
  table.sort(featured, function(a, b)
    return a.stars > b.stars
  end)
  return featured
end

-- Print a numbered feed of active projects.
for index, project in ipairs(featured_projects(projects)) do
  print(string.format("%d. %s: %d stars",
    index, project.name, project.stars))
end
`,
}
