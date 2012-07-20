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

## Generator Method

The example above is obviously not useful for anything, it just creates a dumb input text box in a similar way to just creating in manually. In order to get the most out of `textblocks`, you'll need to customize the block generation process for your needs. This is done by passing a generator function to the textblocks element:

```javascript
$( '#container' ).textblocks(function( val, ev ) {

  return $( '<div>' + val + '<div>' );

});
```

This function will be triggered whenever any text is inserted to the text box, passing in the value and the event that caused the change. The return value of this function is one or more (an array) DOM elements to the newly created blocks

## CSS

`textblocks` makes no assumptions about the CSS style settings of your page. As such, if no fancy CSS is used, `textblocks` will work out of the box. However, most CSS changes will also affect the look and feel of the `textblocks` component. This is actually a feature that allows you to customize the inner parts of `textblocks` to match the visual requirements of your application.

You can target `textblocks` elements with the `ul.textblocks` selection and then traverse and manipulation the children tree with CSS or javascript.