textblocks.js
=============

Customized text box input for interactive UI experiences.

## Introduction

See the Example to understand what we're going to talk about next.

Sometimes, the normal `<input type="text">` text boxes may be a bit underwhelming, or even crappy user experience, when your application requires more interactive control over the layout of the text being types. Specifically, you may want to break down the user input into small blocks of of interactive UI widgets. 

This library allows you to control the behavior and display of how the user input can be transformed into more meaningful components. The way that it works is that when the user type in text, you can transform the text into one or more blocks of customized DOM components. 

## Getting Started

First, include download the `textblocks.js` file and include it in your HTML application. Also, `textblocks.js` is a essentially a jQuery plugin, and therefor depends on it. Make sure to include jQuery as well:

```html
<script type="text/javascript" src="jquery-1.7.2.js"></script>
<script type="text/javascript" src="textblocks.js"></script>
```

Then, create a container for the input. You can decorate it in any way you'd like:

```html
<div id="container" style="border: 1px solid #CCC"></div>
```

Finally, you'll want to initialize the `textblocks` plugin for the container.

```javascript
$( '#container' ).textblocks();
```

That's pretty much it, for now.

## Settings

The example above is obviously not useful for anything. In order to get the most out of `textblocks`, you'll need to customize it for your needs:

```javascript
$( '#container' ).textblocks( settings );
```

`settings` is an object with the following parameters:

1. **delimiter**: A character you want to break the text by into blocks. Alternatively, you can create your own function here that will receive the input text as its only argument, and should return an array of the text splitted as you'd like.

2. **block**: A function for converting the input block text from the `delimiter` function to an HTML element. It receives the block text, and should return a DOM object (created with `document.createElement` or jQuery's `$()`). 
