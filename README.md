# json-api-generator
> Generates api endpoints from handlebar json templates

Inspired by [mock-json-api](https://www.npmjs.com/package/mock-json-api) and relies heavily on [dummy-json](https://github.com/webroo/dummy-json)

## When?
When you want to test your app with a json endpoint that is randomly generated from a template.

## How?

You create your desired json structure by writing handlebars template files that will be converted to json (using [dummy-json](https://github.com/webroo/dummy-json))

See [example](#example)

## Anything fancy?

Multiple endpoints can be defined, just create more templates and put them in your specified template folder.

## Install
```sh
$ npm install json-api-generator --save-dev
```

## Parameters
The exported function takes a map with the following keys:

### `templateDir`
The directory where you keep your template files.
### `helpers (optional)`
A map of generator helpers. Functions that will be available in your template file. Some helpers are available out of the box, see (helpers)[#helpers]
### `log (optional)`
A boolean specifying whether to log each request in the terminal. Defaults to false.
### `port (optional)`
Which port the server should be run on, defaults to 1989.
### `open (optional)`
A boolean specifying if the browser should be opened to the first endpoint automatically when running the server.

## Helpers
Helpers are functions that can generate random data that can be used in the template.
In addition to the helpers available [here](https://github.com/webroo/dummy-json#available-helpers)
 I have added a few others
 
| Helper | Description|
| ----- | ----- |
| `imageUrl` | Sends a random image url from [lorempixel](http://lorempixel.com/). |
| `text` | Lorem ipsum text |
| `randomFloat` | Random decimal number |


## Example
In this example we will create a GeoJSON response.

### `index.js`

```js
"use strict";

var mock = require("mock-json-api");

mock({
	// We keep our templates in a directory called templates
	templateDir: './templates/',
	
	// We create two helpers for GeoJson, they return one of their values.
	helpers: {
        place: function() {
            var place = ["Project","Office","Trip"];
            return place[Math.floor(Math.random() * place.length)];
        },
        markerSymbol: function () {
            var symbols = ["w","suitcase","heart","commercial"];
            return symbols[Math.floor(Math.random() * symbols.length)];
        }
	},
	
	// We wish to see when the resource is requested in the terminal
	log: true,
	
	// We also with that the browser should be opened to the correct url when starting the server
	open: true,
});

```

### `templates/map.hbs`

This is a template that generates a GeoJSON with five points on the map.

```json
{
"type": "FeatureCollection",
"features":
	[
	{{#repeat 5 }}
		{
		"type": "Feature",
		"properties": {
			"id": "{{index}}",
			"title": "{{place}}",
			"description": "{{text}}",
			"image": "{{imageUrl}}"
		},
		"geometry": {
			"coordinates": [
			{{randomFloat -90 90}},
			{{randomFloat -30 60}}
			],
			"type": "Point"
		},
		"id": "{{index}}"
		}
	{{/repeat}}
	]
}

```