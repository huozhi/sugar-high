# Development

- Packages live in `packages/`: `sugar-high`, `react` (`@sugar-high/react`), and `remark`
  (`@sugar-high/remark`). Apps live in `apps/`.
- Use pnpm. Run `pnpm test`, `pnpm build`, and `git diff --check` before submitting changes.
- Keep internal package dependencies on `workspace:^` (or `workspace:*` for private apps); pnpm
  rewrites them to normal semver ranges when publishing.
- Add a Changeset with `pnpm changeset` for user-facing package changes. Do not add one for
  internal-only work unless requested.

# Releases

- Pushes to `main` may create/update the Changesets version PR but must never publish packages.
- Merge the version PR to apply versions and changelogs.
- Publishing is manual: Actions → Publish → Run workflow on `main`, with confirmation `publish`.
- npm publishing uses trusted publishing through OIDC. Do not add npm tokens or publish directly
  from CI.
