# Site-O-Mat Webpack Plugin

A Webpack Plugin for generating a Website as Html-Files from a Markdown-File Structure.

Why? The Main reason i had to update some Websites, but realize there were no benefit
to use a Full CMS or Headless CMS like Directus. Rendering the same pages that a rarely updated
seems like a waste of energy. Why not generate from a hierarchical file structure. Luckily i
i had development a CMS, a few years ago, that runs on Markdown Files it had been never
finished, it was a proof of concept.

## Roadmap

Next will be,

* Some Tests
* Filtering for Queries
* Standalone, handle Webpack only as wrapper

Maybe later,

* Integrate Eta.js and LiquidJS
* Hooks for handle

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

Basic Usage:

```
const SiteomatWebpackPlugin = require('siteomat-webpack-plugin')

plugins: [
    new SiteomatWebpackPlugin(
        './resources/site',
        './resources/views'
    )
]
```

Add options:

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

Pages are Markdown-Files, they are separates in two parts. First part is a yaml-Section,

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

The yaml-Section will be parsed as an Object and available in the Templates. The
second part of the File will be parsed as Markdown, but it could be also empty.

## Nesting

A Page can be a single Markdown-File, or a Directory with a index-File inside.
The Name of a file or a directory will the name of the html-File. To create Sub-pages,
create Sub-directories.

This Structure,

```
index.md
about-me.md
blog
└ index.md
  belly-polaroid-subway.md
```

will be,

```
index.html
about-me.html
blog.html
blog/belly-polaroid-subway.html
```

## Blocks

Each Page can have Blocks. Blocks are like Pages, but they are only accessible
for a single Page. To add Blocks to a page, add a "_blocks"-Directory
to the Directory of the Page.

Markdown-Files in a "_blocks"-Directory will be automatic accessible for a Page. The yaml-Section is Optional.

```
recipes
└ index.md
  _blocks
  └ hero-1.md
    hero-2.md
    hero-3.md
```

Blocks will be Grouped by there name, and sorted by the number at the end. The "hero"-Files
can be used like this,

```
{% hero in page.blocks.hero %}
    {{ hero.content }}
{% endFor %}
```

## Queries

Queries can be used in Templates to get

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

## Sitemap

Sitemap will be generating by Pages. Pages will be only add to Sitemap, if the have meta-robots is set
to "index". Pages default is "index".

## Templates

At this Time only [https://mozilla.github.io/nunjucks/](Nunjunks) is used for Templating.

### Nunjunks

#### Functions

##### asset(path)

This function handle manifest-File from [https://laravel-mix.com/](Laravel-Mix).

```
<script src="{{ asset('js/app.js') }}"></script>
```

#### Filters

##### resize

The Filter is using [https://github.com/lovell/sharp](sharp), for crop, resize and
optimize Images. The Filter needs a relative Path in the File Structure.

Basic Usage:

```
{% page.teaser.src | resize({ 'width': '300' }) %}
```

Add options:

```
{% page.teaser.src | resize({ 'width': '300' }, { sigma: 2 }) %}
```