# Site-O-Mat Webpack Plugin

A Webpack Plugin that wraps [@site-o-mat/core](https://gitea.node001.net/site-o-mat/core).

## Installation

Setup this registry in your project .npmrc file:

```
@helpers:registry=https://gitea.node001.net/api/packages/site-o-mat/npm/
```

Install with npm or yarn

```
npm i --save-dev @site-o-mat/webpack-plugin
yarn add --dev @site-o-mat/webpack-plugin
```

## Configuration

Basic Usage:

```
const SiteomatWebpackPlugin = require('@site-o-mat/webpack-plugin')

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
