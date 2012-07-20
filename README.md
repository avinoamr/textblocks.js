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

## Generator

The example above is obviously not useful for anything, it just creates a dumb input text box in a similar way to just creating in manually. In order to get the most out of `textblocks`, you'll need to customize the block generation process for your needs. This is done by passing a generator function to the textblocks element:

```javascript
$( '#container' ).textblocks(function( val, ev ) {

  return $( '<div>' + val + '<div>' ).val( val );

});
```

This function will be triggered whenever any text is inserted to the text box, passing in the value and the event that caused the change. The return value of this function is one or more (an array) DOM elements to the newly created blocks

Note that the new block was assaigned the relevant value with jQuery's `.val()` method. This is important in order to reverse the block operation (with backspace or delete), and for extracting its value in the future. If you omit it, the value of the element will be evaluated to an empty string which may, or may not, be the desired behavior

# Note on performance
The way `textblocks` works is that whenever an input field is modified (by typing in text, changing focus, etc.) your generators function is called in order to determine if any blocks should be created. This means that the performance of your generator is the most major factor in the overall performance of `textblocks`. A best practice is to nalways check if any blocks should be created first, and fast (avoid complex text comparisons), and return null if nothing should be created. Otherwise, do your fancy calculations.

## Default Value

You can set the default value of the `textblocks` component in two ways:

1. Programmatically find the input text block and change it's value.
2. Set a `data-value` attribute on your container:

```html
<div id="container" data-value="Some Default Value"></div>
```

## CSS

`textblocks` makes no assumptions about the CSS style settings of your page. As such, if no fancy CSS is used, `textblocks` will work out of the box. However, most CSS changes will also affect the look and feel of the `textblocks` component. This is actually a feature that allows you to customize the inner parts of `textblocks` to match the visual requirements of your application.

You can target `textblocks` elements with the `ul.textblocks` selector and then traverse and manipulation the children tree with CSS or javascript.