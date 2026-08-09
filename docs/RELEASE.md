# Release guide

This guide is for Sugar High maintainers. Package publication is intentionally manual even though version preparation is automated.

## Packages

- `sugar-high`
- `@sugar-high/react`
- `@sugar-high/remark`

All packages publish publicly to npm. npm authentication uses trusted publishing through GitHub OIDC; do not add an npm token.

## Prepare a release

1. Add a Changeset that names every package with a user-facing change and selects its semantic version bump.
2. Check the resolved plan:

   ```sh
   pnpm changeset status
   ```

3. Open and merge the Changeset PR.
4. Wait for the `Publish` workflow triggered by the push to `main`. It creates or updates the `Release packages` PR; it does not publish.
5. Review the version PR:
   - package versions are the intended versions;
   - internal `workspace:^` dependencies resolve to the new compatible ranges;
   - generated changelogs accurately describe each package;
   - the Changeset files are consumed.
6. Merge the version PR and wait for the `Test` workflow on `main` to pass.

For a major release, also run the local benchmark and packed-package checks before publishing:

```sh
pnpm --filter sugar-high benchmark
pnpm check:packages
```

## Publish

1. Open **Actions → Publish → Run workflow**.
2. Select the `main` branch.
3. Enter `publish` in the confirmation field and run the workflow.
4. Confirm that the publish job used npm provenance and completed for every intended package.
5. Confirm that Changesets pushed a package tag and created a GitHub Release for every package published by the run.

The workflow is guarded so pushes to `main` can only prepare the version PR. Publishing runs only for a manual dispatch whose confirmation is exactly `publish`.

## Verify

Check the registry versions:

```sh
npm view sugar-high version
npm view @sugar-high/react version
npm view @sugar-high/remark version
```

Then install the published packages in a temporary project and verify the documented imports:

```js
import { highlight } from 'sugar-high'
import { parse, generate, render } from 'sugar-high/core'
import { lang } from 'sugar-high/lang'
import { Code, Editor } from '@sugar-high/react'
import remarkSugarHigh from '@sugar-high/remark'
```

Changesets creates package-specific tags and GitHub Releases from the reviewed changelogs. For an occasional major umbrella release, a maintainer may additionally publish curated notes under the repository's `vX.Y.Z` tag after npm verification.

## Failure handling

- If preparation fails, fix the Changeset or workflow in a normal PR; never edit generated versions directly on `main`.
- If publishing fails before a package reaches npm, fix the cause and rerun the manual workflow.
- If only some packages publish, do not change their versions. Rerun after fixing the failure; Changesets skips versions already present on npm and publishes the remaining packages.
- If npm succeeds but GitHub release creation fails, create the missing package tag and release manually from its generated changelog; already-published versions are not recreated by a later publish run.
- Never replace OIDC with a long-lived npm token as a workaround.
