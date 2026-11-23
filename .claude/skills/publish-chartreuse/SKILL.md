---
name: publish-chartreuse
description: Release and publish a new version of the Chartreuse design system (@chartreuse/ui) from this repository. Use when asked to "publish Chartreuse", "release Chartreuse", "cut a release", "ship a new version", or "commit, push, and release". Covers updating the docs, testing, the version bump, the changelog entry, pushing main, and creating the GitHub release that publishes the package.
---

# Publish Chartreuse

A release has two commits on `main`: the feature work, then `Release Chartreuse X.Y.Z`. Then you push and create a GitHub release. Publishing the GitHub release runs `.github/workflows/publish-package.yml`, which builds, tests and publishes the package to GitHub Packages. Each push to `main` also runs `deploy-pages.yml`, which redeploys the docs site at https://shiiinichi.github.io/chartreuse/.

Work on the current branch (`main`). Do not create branches or pull requests. Never add `Co-Authored-By`, "Generated with Claude Code" or any other attribution to commits or release notes.

## 1. See what is shipping

```sh
git status --short
gh release list --limit 1                    # latest release, e.g. v1.15.0
git log --oneline origin/main..HEAD          # unpushed commits
git diff --stat                              # uncommitted work
```

Tags are created by `gh release create` on GitHub and are usually missing locally. Run `git fetch --tags` before comparing against a tag.

Read every uncommitted change, including any you did not make in this session. If a change looks unfinished, ask the user before including it.

## 2. Update the docs for every change

Check each item for every user-facing change:

- **Reference:** `src/docs/reference/*.ts`, the component's props, defaults and notes. This feeds both the docs site and the `chartreuse` CLI that agents query, so it must match the code.
- **Examples:** the docs examples for the component (`src/docs/*Demo.tsx`, `src/docs/form-scenarios/*`, and similar). Add one for each new feature.
- **README:** `README.md`. Update any paragraph that describes the changed behaviour.
- **Packaged skill:** `.agents/skills/chartreuse/SKILL.md`. Change it only when setup or CLI usage changes; it ships inside the package.

## 3. Verify

```sh
npx tsc --noEmit
npm test          # builds the library, then runs node --test test/*.test.mjs
```

All tests must pass. `npm test` checks, among other things, that every reference usage example type-checks as pasted. For visual changes, check the docs site in the browser preview (`docs` in `.claude/launch.json`, port 5173).

## 4. Commit the feature work

Stage the feature and docs changes, without the version bump, and commit them with a plain descriptive message, for example `Add collapsible TextField, navbar toggle defaults, and composer controls`.

## 5. Make the release commit

Choose the version with semver:
- **Minor:** new props, components or default visuals.
- **Patch:** fixes only.
- **Major:** removed or renamed APIs, or breaking markup changes.

```sh
npm version X.Y.Z --no-git-tag-version   # updates package.json and package-lock.json
```

Add an entry to the top of the `releases` array in `src/docs/Pages.tsx`:

```ts
{
  version: 'X.Y.Z',
  date: 'YYYY-MM-DD',          // today
  title: 'Short list of the headline changes',
  summary: 'One or two sentences: what was added, that additions are opt-in, and any change to existing defaults or markup.',
  changes: [
    'One sentence or two per change, naming the component and the prop, value or default.',
  ],
},
```

Run `npx tsc --noEmit`, then commit `package.json`, `package-lock.json` and `src/docs/Pages.tsx` as `Release Chartreuse X.Y.Z`.

## 6. Push

```sh
git push origin main
```

## 7. Create the GitHub release

Copy the bullets from the `Pages.tsx` entry, wrapping code names in backticks, then add the link line with the previous version:

```sh
gh release create vX.Y.Z --target main --title "Chartreuse vX.Y.Z" --notes-file <notes.md>
```

The notes file uses this format:

```markdown
## Changes

- `TextField` adds `collapsible`, ...

[Documentation changelog](https://shiiinichi.github.io/chartreuse/#changelog) · [Full changelog](https://github.com/shiiinichi/chartreuse/compare/vPREV...vX.Y.Z)
```

Write the notes file in the scratchpad directory, not in the repository.

## 8. Confirm the publish

```sh
gh run list --workflow publish-package.yml --limit 1
gh run watch <run-id> --exit-status       # run in the background; it takes a few minutes
gh run list --workflow deploy-pages.yml --limit 1
```

Report the release URL, the version, and whether the publish and Pages runs passed. If the publish fails, read the log with `gh run view <run-id> --log-failed`. The usual cause is a `package.json` / `package-lock.json` version mismatch or a release tag that does not equal `v<package.json version>`.
