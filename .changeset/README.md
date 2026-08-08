# Changesets

Run `pnpm changeset` for every user-facing package change and commit the generated Markdown file.
After changes land on `main`, Changesets maintains a release PR. Merging that PR publishes all
updated packages to npm.

Publishing uses npm trusted publishing through GitHub Actions OIDC; no npm access token is stored.
Configure `sugar-high`, `@sugar-high/react`, and `@sugar-high/remark` on npm to trust this repository
and `.github/workflows/release.yml`. The workflow's automatic `github.token` is used only for the
version pull request and GitHub commits.
