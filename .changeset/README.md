# Changesets

Run `pnpm changeset` for every user-facing package change and commit the generated Markdown file.
After changes land on `main`, Changesets maintains a release PR. Merging that PR updates package
versions but does not publish anything. Publishing requires manually running the `Publish` workflow
from GitHub Actions on `main`.

Publishing uses npm trusted publishing through GitHub Actions OIDC; no npm access token is stored.
Configure `sugar-high`, `@sugar-high/react`, and `@sugar-high/remark` on npm to trust this repository
and `.github/workflows/publish.yml`. The workflow's automatic `github.token` is used only for the
version pull request and GitHub commits.
