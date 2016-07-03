# Garden Loader

[![NPM Package](https://img.shields.io/npm/v/garden-loader.svg?style=flat-square)](https://www.npmjs.com/package/garden-loader)

A minimal ES6 System and AMD compatible module loader.

## Overview

This package implements a partial System and Asynchronous Module Definition (AMD) polyfill. It is meant to be used in the browser, rather than node.js. It is based off the [ES6 micro-loader](https://github.com/caridy/es6-micro-loader) project.

## Who is this loader for?

This loader doesn't implement the entire ES6 loader specification. It is meant to be a light weight loader that is suitable for development and production for developers willing to prepare their modules for easier distribution.

Use the garden loader if:

- You are developing in ES6, but transpiling your code beforhand with a tool like [Babel](http://babeljs.io/).
- Your project includes popular legacy modules formatted in [UMD](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/#umd-universal-module-definition). Most popular Javascript frameworks use the UMD format which supports AMD.
- Your project is large enough that you can't or don't want to combine your code with a tool like [Browserify](http://browserify.org/) or [webpack](https://webpack.github.io/).
- You want to do the work at transpile time to format your code correctly, rather than runtime.

## Who is this loader NOT for?

Don't use the garden loader if:

- You don't know what a Javascript module is or don't want to use them.
- You have a small project that can get away with just combining all your code into one file.
- You want to use CommonJS modules in the browser. In this case you'll need to reformat them into one of the module formats supported by the garden loader.

## Usage

The loader is available in `dist/garden-loader.js`. Include it in your page before loading any files, usually as the first script on your page. The only configuration option is the `System.baseURL` property which tells the loader where your scripts are. To load scripts call `System.import()` or `System.importAll()`. Both methods return a [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) object.

*Note: The garden loader depends on the relatively new Promise class being present. If you want to support older browsers the include a promise polyfill before the garden loader. One is included in the dist folder, but any promise polyfill library should work.*

Here is a basic example:

```html

<html>
<head>
<!-- Include a promise polyfill for old IE. -->
<script src="path/to/dist/promise.js"></script>
<script src="path/to/dist/garden-loader.js"></script>
<script>
  System.baseURL = "js";

  System.import('juery').then(function ($) {
    // jQuery will load and be available.
  });
</script>

</head>
  ...
</html>
```

## Anonymous vs. Named Modules

Both AMD and the System module formats have the concept of named and anonymous modules.

- **Anonymous** modules are defined without a name, rather their name is taken from their filename. It's generally recommended that you code anonymous modules so that you can move your files around during development. Modules coded in ES6 are all anonymous.

- **Named** modules are defined with a name. Usually, modules are named during a build process so that you can combine several modules into one file for production.

A good rule of thumb is to code anonymous modules and then name them in your build.

## Garden Loader API

The loader is all contained in the `System` global namespace. It also declares the global `define()` function to support AMD modules.

### System.amdDefine([[name ,] deps,] factory)

Define an AMD module.

```js
define('react', ['react-dom'], function (ReactDOM) {
    // ...
});
```

### System.amdRequire()

Use this function for backwards compatibility with [RequireJS](http://requirejs.org/). If want to use it you should define it in the global scope:

```js
window.require = System.amdRequire;
```

### System.baseURL

The base URL of your Javascript files. This will be prepended to module names when loading.

### System.get(): Module

Get a module that has already been loaded.

```js
var module = System.get('module-name')
```

### System.has(): Boolean

Returns whether or not a given module has been loaded.

```js
if (System.has('module-name')) {
    // ...
}
```

### System.import(name): Promise<Module>

Import a module by name. This function will return the module from its cache if it exists or load the module asynchronously.

```js
System.import('jquery').then(function($) {
    // jQuery was loaded asynchronously and is now available.
});
```

### System.importAll(name1, name2, ...): Promise<Module[]>

This is a convenience method for importing multiple modules. It's commonly used with the `Promise.spread()` method that is provided with the garden loader. This method can reduce a lot of boilerplate code if you need to import several dependencies to get your application going.

```js
System.importAll('react', 'jquery', 'app').spread(
    function(React, $, Application) {

    }
);
```


### System.register([name ,] deps, declare)

Define a new module in the System format. This format is a bit complicated and is usually only the result of transpiling ES6 code.

### System.set(name, module)

Manually set a module in the registry. This is a useful for making modules that have already been loaded available to the loader so that they can me used as dependencies.

```html
<script src="js/moment.js"></script>
<script src="js/garden-loader.min.js"></script>
<script>
  // Moment.js was loaded prior to garden loader, so manually install it.
  System.set('moment', moment);
</script>
```

## Gotchas

If you are familiar with Javascript modules then the garden loader should be pretty straightforward. However there are a few gotchas with module loaders that you should be aware of.

### The loader will hide UMD modules.

If you are used to including a library and then accessing it through a global variable you might be puzzled that the global variable no longer exists. This is because most modules look for a module loader and if they find it will instead define themselves as a module. If you still need the module to be accessed globally you'll need to write a little bit of code.

```html
<script src="js/garden-loader.min.js"></script>
<script src="js/react.js"></script>
<script>
  if (React == undefined) {
    // React is not available globally because it was installed as a module.
    React = System.get('react').default;
  }
</script>
```

### You can't manually include anonymous modules.

If you manually include a module that is registered anonymously then the module loader will not recognize it. Make sure that you only include anonymous modules with `System.import()` or `System.importAll()`.

This can especially be an issue with popular Javascript frameworks because most of them use anonymous modules. You can use a tool such as [grunt AMD tamer](https://www.npmjs.com/package/grunt-amd-tamer). To name anonymous modules before including them manually.