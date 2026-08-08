# Changesets

Run `pnpm changeset` for every user-facing package change and commit the generated Markdown file.
After changes land on `main`, Changesets maintains a release PR. Merging that PR publishes all
updated packages to npm.
