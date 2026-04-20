# Elysia Corp — MadLab Aurora

A frontend site built with Astro. This repository was initialized from the Astro minimal template and prepared for development.

## Prerequisites

- Node.js >= 22.12.0
- Git
- (Optional) Git LFS for large binary assets

## Quick start

1. Install dependencies:

```sh
npm install
```

2. Start development server:

```sh
npm run dev
```

3. Build for production:

```sh
npm run build
```

4. Preview the production build locally:

```sh
npm run preview
```

## Notes about this repository

- Git LFS is configured and tracked patterns are in `.gitattributes`. If you need LFS locally, install it and run `git lfs install`.
- Large unneeded files were removed from history and backup branches were created (e.g. `backup/main-before-clean`, `backup/before-remove-package-lock`).

## CI

A GitHub Actions workflow was added at `.github/workflows/ci.yml` to run an install and build on pushes and pull requests.

## Learn more

See the Astro docs: https://docs.astro.build
