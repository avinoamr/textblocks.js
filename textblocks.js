/**
 * textblocks.js
 * 
 * Customized text box input for interactive UI experiences
 * https://github.com/avinoamr/textblocks.js
 *
 * The MIT License
 * 
 * Copyright (c) 2010-2012 Roi Avinoam <avinoamr@gmail.com> and jquery-selection authors.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Uses: Rangy Text Inputs (MIT License) by Tim Down (http://code.google.com/p/rangy/). See below.
 */
(function( $ ) {

    // key constants
    var KEY_LEFT = 37,
        KEY_RIGHT = 39,
        KEY_BACKSPACE = 8,
        KEY_DELETE = 46;

    //
    jQuery.fn.textblocks = function( settings ) {

        // apply to all elements
        var that = this;
        settings || ( settings = {} );

        //
        var container = $( '<ul class="textblocks"></ul>' )
            .css( 'padding', '0' )
            .css( 'margin', '0' )
            .css( 'list-style', 'none')
            .appendTo( this );

        this.append( $( '<div></div>' ).css( 'clear', 'both' ) );

        //
        var make_block = function( element, value ) {

            // block handling function
            var block_fn = settings.block || function( text ) { return $( '<span>' + text + '</span>' ) };

            // TODO: add support for a delimiter function (default delimiter is a simple split)
            var delimiter = ( 'function' == typeof settings.delimiter ) ? settings.delimiter : function( text ) {

                return text.split( settings.delimiter || ' ' );

            };

            // wrap the element
            if ( element ) {

                element.css( 'float', 'left' )

            }

            // create the input text box
            var text = $( '<input type="text" />')
                .css( 'border', 'none')
                .css( 'outline', 'none')
                .css( 'width', '3px' )
                .css( 'float', 'left' )
                .css( 'position', 'relative' )

                // handle changes to the text input
                .on( 'input change blur focus', function() {

                    var $this = $( this );
                    var parent = $this.parent();
                    var prev = parent.prev();
                    var val = $this.val();

                    // dynamic width
                    // TODO: Make it smarter. Set the value into a temporary text field, set its 'size' attribute and then read the width attribute
                    $this.css( 'width', ( 3 + ( 13 * val.length ) ) );

                    // dynamic position
                    var height_compare = parent;
                    if ( prev.length ) {
                        height_compare = prev;
                    }
                    height_compare = height_compare.children().last();

                    var top = parseInt( height_compare.css( 'margin-top' ) ) /* + 
                        ( ( height_compare.innerHeight() - $this.innerHeight() ) / 2 );*/

                    $this.css( 'margin-top', top + 'px' );

                    // create the blocks
                    var block_values = delimiter( val );
                    if ( 1 >= block_values.length ) return; // no delimiter found, no changes require.

                    var before = parent, first;
                    for ( var i = block_values.length - 2 ; i >= 0  ; i -- ) {
                        var block_value = block_values[ i ];

                        // create & insert the new block element
                        before = make_block( block_fn( block_value ), block_value )
                                    .insertBefore( before );

                        !first && ( first = before );

                    }

                    // clear up the text boxes and focus on next text box
                    $this.val( '' );
                    first.next().find( 'input' )
                        .val( block_values[ block_values.length - 1 ] )
                        .focus()

                })

                // handle traversal a long the block values
                .on( 'keydown', function( ev ) {

                    // get the selection data
                    var selection = $( this ).getSelection();
                    if ( selection.start != selection.end ) {
                        return; // disregard selection ranges
                    }
                    var cursor = selection.start;
                    var $this = $( this );
                    var end = $this.val().length;

                    // move backwards (left-key)
                    if ( 0 == cursor && KEY_LEFT == ev.keyCode ) {

                        // find and focus on text input box of the previous block
                        $this.parent().prev().find( 'input[ type="text" ]' ).focus();

                    }

                    // move forward (right-key)
                    if ( end == cursor && KEY_RIGHT == ev.keyCode ) {

                        // find and focus on the text input box of the next block
                        $this.parent().next().find( 'input[ type="text" ]' ).focus();

                    }

                    // remove the previous block (backspace)
                    if ( 0 == cursor && KEY_BACKSPACE == ev.keyCode ) {

                        var parent = $this.parent();
                        var prev = parent.prev();
                        prev.detach(); // remove the previous block

                        // read the values of the removed text box, block and the current input box
                        var text_val = prev.find( 'input[ type="text" ]' ).val();
                        var val = prev.attr( 'data-value' );
                        var input = parent.find( 'input[ type="text" ]' );

                        // set the input value of the current block
                        input
                            .val( text_val + val + input.val() )
                            .setSelection( text_val.length + val.length, text_val.length + val.length )
                            .focus();

                        ev.preventDefault(); // this backspace shouldn't remove any characters

                    }

                    // remove the next block (delete)
                    if ( end == cursor && KEY_DELETE == ev.keyCode ) {

                        var parent = $this.parent();
                        var next = parent.next();
                        parent.detach(); // remove this block (practically the next)

                        // read the values of the removed text box, block and the next input box
                        var text_val = $this.val();
                        var val = parent.attr( 'data-value' );
                        var input = next.find( 'input[ type="text" ]' );

                        // set the input value of the next block
                        input
                            .val( text_val + val + input.val() )
                            .setSelection( text_val.length, text_val.length )
                            .focus();

                        ev.preventDefault(); // this delete shouldn't remove any characters

                    }

                });

            return $( '<li></li>' )
                .attr( 'data-value', value )
                .css( 'float', 'left' )
                .css( 'display', 'inline' )
                .append( text )
                .append( element );

        };

        // first editing block
        container.append( make_block() );

        // focus the last text box
        this.on( 'click', function( ev ) {
            if ( ev.target != that[ 0 ] ) return true;
            container.find( 'input[ type="text" ]' ).last().focus();
        });

        return this;

    };

})( jQuery );


/*
 Rangy Text Inputs, a cross-browser textarea and text input library plug-in for jQuery.

 Part of Rangy, a cross-browser JavaScript range and selection library
 http://code.google.com/p/rangy/

 Depends on jQuery 1.0 or later.

 Copyright 2010, Tim Down
 Licensed under the MIT license.
 Version: 0.1.205
 Build date: 5 November 2010
*/
(function(n){function o(e,g){var a=typeof e[g];return a==="function"||!!(a=="object"&&e[g])||a=="unknown"}function p(e,g,a){if(g<0)g+=e.value.length;if(typeof a=="undefined")a=g;if(a<0)a+=e.value.length;return{start:g,end:a}}function k(){return typeof document.body=="object"&&document.body?document.body:document.getElementsByTagName("body")[0]}var i,h,q,l,r,s,t,u,m;n(document).ready(function(){function e(a,b){return function(){var c=this.jquery?this[0]:this,d=c.nodeName.toLowerCase();if(c.nodeType==
1&&(d=="textarea"||d=="input"&&c.type=="text")){c=[c].concat(Array.prototype.slice.call(arguments));c=a.apply(this,c);if(!b)return c}if(b)return this}}var g=document.createElement("textarea");k().appendChild(g);if(typeof g.selectionStart!="undefined"&&typeof g.selectionEnd!="undefined"){i=function(a){return{start:a.selectionStart,end:a.selectionEnd,length:a.selectionEnd-a.selectionStart,text:a.value.slice(a.selectionStart,a.selectionEnd)}};h=function(a,b,c){b=p(a,b,c);a.selectionStart=b.start;a.selectionEnd=
b.end};m=function(a,b){if(b)a.selectionEnd=a.selectionStart;else a.selectionStart=a.selectionEnd}}else if(o(g,"createTextRange")&&typeof document.selection=="object"&&document.selection&&o(document.selection,"createRange")){i=function(a){var b=0,c=0,d,f,j;if((j=document.selection.createRange())&&j.parentElement()==a){f=a.value.length;d=a.value.replace(/\r\n/g,"\n");c=a.createTextRange();c.moveToBookmark(j.getBookmark());j=a.createTextRange();j.collapse(false);if(c.compareEndPoints("StartToEnd",j)>
-1)b=c=f;else{b=-c.moveStart("character",-f);b+=d.slice(0,b).split("\n").length-1;if(c.compareEndPoints("EndToEnd",j)>-1)c=f;else{c=-c.moveEnd("character",-f);c+=d.slice(0,c).split("\n").length-1}}}return{start:b,end:c,length:c-b,text:a.value.slice(b,c)}};h=function(a,b,c){b=p(a,b,c);c=a.createTextRange();var d=b.start-(a.value.slice(0,b.start).split("\r\n").length-1);c.collapse(true);if(b.start==b.end)c.move("character",d);else{c.moveEnd("character",b.end-(a.value.slice(0,b.end).split("\r\n").length-
1));c.moveStart("character",d)}c.select()};m=function(a,b){var c=document.selection.createRange();c.collapse(b);c.select()}}else{k().removeChild(g);window.console&&window.console.log&&window.console.log("TextInputs module for Rangy not supported in your browser. Reason: No means of finding text input caret position");return}k().removeChild(g);l=function(a,b,c,d){var f;if(b!=c){f=a.value;a.value=f.slice(0,b)+f.slice(c)}d&&h(a,b,b)};q=function(a){var b=i(a);l(a,b.start,b.end,true)};u=function(a){var b=
i(a),c;if(b.start!=b.end){c=a.value;a.value=c.slice(0,b.start)+c.slice(b.end)}h(a,b.start,b.start);return b.text};r=function(a,b,c,d){var f=a.value;a.value=f.slice(0,c)+b+f.slice(c);if(d){b=c+b.length;h(a,b,b)}};s=function(a,b){var c=i(a),d=a.value;a.value=d.slice(0,c.start)+b+d.slice(c.end);c=c.start+b.length;h(a,c,c)};t=function(a,b,c){var d=i(a),f=a.value;a.value=f.slice(0,d.start)+b+d.text+c+f.slice(d.end);b=d.start+b.length;h(a,b,b+d.length)};n.fn.extend({getSelection:e(i,false),setSelection:e(h,
true),collapseSelection:e(m,true),deleteSelectedText:e(q,true),deleteText:e(l,true),extractSelectedText:e(u,false),insertText:e(r,true),replaceSelectedText:e(s,true),surroundSelectedText:e(t,true)})})})(jQuery);