# Sugar High Monorepo

This monorepo contains packages and applications for the Sugar High syntax highlighter ecosystem.

## Packages

- **[sugar-high](./packages/sugar-high)** - Super lightweight JSX syntax highlighter
- **[remark-sugar-high](./packages/remark-sugar-high)** - Remark plugin for sugar-high syntax highlighter

## Applications

- **[docs](./apps/docs)** - Documentation and demo website

## Development

This monorepo uses pnpm workspaces. To get started:

```bash
# Install dependencies for all packages
pnpm install

# Build all packages
pnpm build

# Run tests for all packages
pnpm test

# Run development server for docs
pnpm docs:dev

# Build docs
pnpm docs:build
```

## Working with individual packages

You can also work with individual packages:

```bash
# Work with sugar-high
cd packages/sugar-high
pnpm test

# Work with remark-sugar-high
cd packages/remark-sugar-high
pnpm build

# Work with docs
cd apps/docs
pnpm dev
```

## Publishing

Each package can be published separately:

```bash
# Publish sugar-high
cd packages/sugar-high
pnpm publish

# Publish remark-sugar-high
cd packages/remark-sugar-high
pnpm publish
```

## License

MIT

