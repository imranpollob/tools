# Tools by Imran Pollob

A simple gallery of online tools and downloadable apps, with search and filters.

## Run locally

```sh
npm install
npm run dev
```

## Update projects

Edit `src/tools.json` to add or update a project. Set its `priority` to control where it appears in its section. Preview images go in `public/previews/`.

## Build and deploy

Run `npm run build` to create the site in `dist/`. The included GitHub Actions workflow deploys it to GitHub Pages when changes are pushed to `main`.
