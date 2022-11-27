# happy-site-webpack-plugin

**In Development**

A Webpack Plugin to generate a Website from a hierarchical Markdown file structure.

Why? The Main reason i had to update some Websites, but realise there were no benfit
to use a Full CMS or Headless CMS like Directus. Rendering the same pages that a rarley updated
seems like a waste of energy. Why not generate from a hierachical file structure. Luckly i
i had development a CMS that runs on Markdown File a few years ago as a proof of concept.

## Roadmap

Next will be,

* Some tests
* Integrate Eta.js and LiquidJS

## Installation

```
npm i --save-dev site-o-mat-webpack-plugin
yarn add --dev site-o-mat-webpack-plugin
```

## Configuration

```
const SiteOmatWebpackPlugin = require('site-o-mat-webpack-plugin')

plugins: [
    new SiteOmatWebpackPlugin(
        './resources/site',
        './resources/views'
    )
]
```

| Name        | Type      | Default | Description |
|-------------|-----------|---------|-------------|
| destination | {String}  | null    | If not set, it will use the public path |
| htmlMinify  | {Boolean} | true    | Minify Html and remove all Whitespace |

## Pages

```
---
title: "health goth DIY tattooed"
view: "home.njk"
meta:
    description: "La"
media:
    teaser:
        src: "_images/test.jpeg"
        alt: "cold-pressed"
---
```

## Blocks

## Find

## Templates

