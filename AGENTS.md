# Development

- Packages live in `packages/`: `sugar-high`, `react` (`@sugar-high/react`), and `remark`
  (`@sugar-high/remark`). Apps live in `apps/`.
- Always use the running development server at `http://localhost:3000` to verify site changes; do
  not run a production build for verification.
- Use pnpm. Run `pnpm test`, `pnpm build`, and `git diff --check` before submitting changes.
- Keep internal package dependencies on `workspace:^` (or `workspace:*` for private apps); pnpm
  rewrites them to normal semver ranges when publishing.
- Add a Changeset with `pnpm changeset` for user-facing package changes. Do not add one for
  internal-only work unless requested.

# Architecture

- Keep the default API focused on the common path. Put advanced composition in existing subpaths
  such as `sugar-high/core`; do not add an export or option when the current API can express it.
- Prefer short canonical names with one meaning. Avoid aliases for the same operation, duplicate
  exports, and separate language implementations for compatible dialects.
- Keep options few and orthogonal: language selection, class composition, and mutable display
  hooks should remain distinct. The root highlighter must not forward undocumented options into
  core parsing.
- Treat exported language metadata and configurations as shared read-only data. Do not mutate the
  registry at runtime; copy a configuration before extending it.
- Bundle size is part of every API and architecture decision. Measure affected entry points and
  prefer the simpler design when added abstraction does not earn its bytes.
- Run `pnpm --filter sugar-high benchmark` for architecture changes and include the affected
  minified and gzip sizes in the pull request description.

# Releases

- Pushes to `main` may create/update the Changesets version PR but must never publish packages.
- Merge the version PR to apply versions and changelogs.
- Publishing is manual: Actions → Publish → Run workflow on `main`.
- npm publishing uses trusted publishing through OIDC. Do not add npm tokens or publish directly
  from CI.
- The manual publish job uses Changesets to create package tags and GitHub Releases from the
  reviewed changelogs. Major umbrella releases may still use separately curated `vX.Y.Z` notes.
