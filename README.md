# Site-O-Mat Webpack Plugin

A Webpack Plugin for generating a Website as Html-Files from a Markdown File Structure.

Why? The Main reason i had to update some Websites, but realise there were no benfit
to use a Full CMS or Headless CMS like Directus. Rendering the same pages that a rarley updated
seems like a waste of energy. Why not generate from a hierachical file structure. Luckly i
i had development a CMS that runs on Markdown File a few years ago as a proof of concept.

## Roadmap

Next will be,

* Some tests
* Better Filtering in Queries

Maybe later,

* Integrate Eta.js and LiquidJS

## Installation

Setup this registry in your project .npmrc file:

```
@helpers:registry=https://gitea.node001.net/api/packages/HerrHase/npm/
```

Install with npm or yarn

```
npm i --save-dev @helpers/siteomat-webpack-plugin
yarn add --dev @helpers/siteomat-webpack-plugin
```

## Configuration

```
const SiteomatWebpackPlugin = require('siteomat-webpack-plugin')

plugins: [
    new SiteomatWebpackPlugin(
        './resources/site',
        './resources/views'
    )
]
```

or

```
plugins: [
    new SiteomatWebpackPlugin(
        './resources/site',
        './resources/views',
        {
            <options>
        }
    )
]
```

| Name        | Type      | Default | Description |
|-------------|-----------|---------|-------------|
| destination | {String}  | null    | If not set, it will use the public path |
| htmlMinify  | {Boolean} | true    | Minify Html and remove all Whitespace |

## Pages

Pages are Markdown-Files, they are seperates in two parts. First part is a yaml-Section,

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

These yaml will be parsed as a Object and available in Templates. "view" is required. Second
part will be parsed as Markdown, but could be empty.

## Nesting

```
index.md
about-me.md
blog
└ index.md
  belly-polaroid-subway.md
```

will be

```
index.html
about-me.html
blog.html
blog/belly-polaroid-subway.html
```

## Blocks



"_blocks" in a Directory,

## Queries

### Pages

Basic Usage:

```
pageQuery.find()
```

or with options,

| Name        | Type      | Default | Description |
|-------------|-----------|---------|-------------|
| parent      | {String}  | /       | Directory for start query |
| deep        | {Integer} | -1      | Deep of Recursive |
| orderBy     | {Array}   | null    | Name of field sorting, a "-" in front of the. Nested fields are also possible. |


