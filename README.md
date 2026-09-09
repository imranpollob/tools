# Tools by Imran Pollob

A responsive, one-page gallery of Imran Pollob’s usable tools, with instant search and online / local installation filters. Built with vanilla JavaScript and Vite.

## Run

```sh
npm install
npm run dev
```

## Validate and build

```sh
npm test
npm run build
npm run preview
```

With the dev server running, use `npm run test:browser` to check live search, filters, keyboard controls, previews, and responsive layouts in Chromium.

Deploy the generated `dist/` directory to any static host. Relative asset paths support both root domains and subdirectories such as GitHub Pages.

## Update the collection

Edit `src/tools.json`. Every entry has a repository, title, short subtitle, category, availability (`online` or `install`), destination URL, action label, preview filename, and optional search tags. Put images in `public/previews/`.

The collection follows the owner's supplied 19-project list, including its order, titles, descriptions, repository names, and availability types: 15 online apps and 4 installable tools. Edit `src/tools.json` to maintain this static catalog; it makes no GitHub API calls at runtime.

Online destinations use the repository's published homepage. GitHub Star Calculator is an installable tool, as clarified by the owner, and links to its PyPI package. Note CLI and Slugcopy link to their published npm packages; Pomodoro Timer links to downloadable releases.

Images come from repository screenshots and captured live pages. Tools without screenshots use clearly labeled illustrative previews. To capture missing previews, install Chromium with `npx playwright install chromium` and run `node scripts/capture-previews.js`.

Search matches all entered words across title, description, category, repository, and tags. Press `/` to focus search, or Escape to clear it. All content links open in a new tab. Google Fonts is the only runtime third-party asset dependency; system sans-serif fonts are used as a fallback.

## Brand theme

The provided brand tokens live in `src/theme.css`. The UI uses Plus Jakarta Sans for body text and controls, Playfair Display for headings, and the supplied logo in the header, footer, and favicon. Preview surrounds use the brand palette; project screenshots retain their original appearance.

Light and dark themes follow the system preference until a visitor chooses a theme with the header button. The selection is saved locally, with a safe fallback when browser storage is unavailable.

## GitHub Pages

1. Push this repository to GitHub on the `main` branch.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. The included `.github/workflows/pages.yml` installs dependencies, runs tests, builds, and deploys `dist/`. It runs on pushes to `main` and can also be started manually.

The single-page site uses relative asset paths (`base: './'`), so the same build works at `/tools/`, another repository path, or a custom domain. The workflow follows the [Vite GitHub Pages deployment guide](https://vite.dev/guide/static-deploy.html#github-pages). No deployment has been triggered locally.
