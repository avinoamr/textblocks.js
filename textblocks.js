/**
 * textblocks.js
 * 
 * Customized text box input for interactive UI experiences
 * https://github.com/avinoamr/textblocks.js
 *
 * TODO
 *   1. Support range selection across multiple blocks, plus Ctrl+A
 *
 * THANKS
 *   Rangy Text Inputs (MIT License) by Tim Down (http://code.google.com/p/rangy/)
 *   jQuery autoGrow plugin (https://github.com/rkivalin/jquery-autogrow)
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
 * Uses: . See below.
 */
(function( $ ) {

    // key constants
    var KEY_LEFT = 37,
        KEY_RIGHT = 39,
        KEY_BACKSPACE = 8,
        KEY_DELETE = 46;

    //
    var auto_size = function( ele ) {

        // dynamic width
        // TODO: Make it smarter. Set the value into a temporary text field, set its 'size' attribute and then read the width attribute
        // var tmp = ele.clone( false )
        //     //.hide()
        //     .css( 'width', 'auto' )
        //     .attr( 'size', ele.val().length )
        //     .insertAfter( ele );

        ele.attr( 'size', ele.val().length );
        
        // console.log( tmp.width() );

        // ele.css( 'width', tmp.width() );
        //tmp.detach();

    };

    //
    jQuery.fn.textblocks = function( generator_fn ) {

        // apply to all elements
        var that = this;

        // default generator (dumb text box)
        ( generator_fn ) || ( generator_fn = function() {} );

        //
        var container = $( '<ul class="textblocks" />' )
            .appendTo( this );

        this.append( $( '<div />' ).css( 'clear', 'both' ).hide() )

        //
        var make_block = function( element ) {

            // wrap the element
            if ( element ) {

                element = $( '<span />')
                    .css( 'float', 'left' )
                    .append( element );

            }

            // create the input text box
            var autogrow = false;
            var text = $( '<input type="text" />')
                .css( 'width', '3px' )
                .css( 'min-width', '3px' )

                // handle changes to the text input
                .on( 'input change blur focus', function( ev ) {

                    var $this = $( this );
                    var parent = $this.parent();
                    var prev = parent.prev();
                    var val = $this.val();

                    autogrow = ( autogrow ) ? autogrow.trigger( 'input.autogrow' ) : $this.autoGrow( 3 );

                    // generate the new blocks
                    var blocks = generator_fn( val, ev );
                    if ( !blocks ) {
                        return; // no blocks created, change nothing
                    }
                    ( !$.isArray( blocks ) ) && ( blocks = [ blocks ] );

                    // inject the blocks to the blocks list
                    var val = '', current;
                    for ( var i = 0 ; i < blocks.length ; i ++ ) {

                        var block = blocks[ i ];
                        if ( "string" == typeof block || "number" == typeof block ) {

                            val += block;

                        } else {

                            block = make_block( block );
                            current = ( current ) ? block.insertAfter( current ) : block.insertBefore( parent );

                            var input = current.find( 'input' ).val( val );
                            auto_size( input );

                            val = '';

                        }

                    }

                    // excess string blocks
                    $this.val( val ).focus();

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
                        $this.parent().prev().find( 'input' ).focus();

                    }

                    // move forward (right-key)
                    if ( end == cursor && KEY_RIGHT == ev.keyCode ) {

                        // find and focus on the text input box of the next block
                        $this.parent().next().find( 'input' ).focus();

                    }

                    // remove the previous block (backspace)
                    if ( 0 == cursor && KEY_BACKSPACE == ev.keyCode ) {

                        ev.preventDefault(); // this backspace shouldn't remove any characters

                        var parent = $this.parent();
                        var prev = parent.prev();

                        // skip if this is the first block
                        if ( !prev.length ) {
                            return;
                        }

                        prev.detach(); // remove the previous block

                        // read the values of the removed text box, block and the current input box
                        var text_val = prev.find( 'input' ).val();
                        var val = prev.find( 'input' ).siblings( 'span' ).children().first().val();
                        var input = parent.find( 'input' );

                        // set the input value of the current block
                        input
                            .val( text_val + val + input.val() )
                            .setSelection( text_val.length + val.length, text_val.length + val.length )
                            .focus();

                    }

                    // remove the next block (delete)
                    if ( end == cursor && KEY_DELETE == ev.keyCode ) {

                        ev.preventDefault(); // this delete shouldn't remove any characters

                        var parent = $this.parent();
                        var next = parent.next();

                        // skip if this is the last block
                        if ( !next.length ) {
                            return;
                        }

                        parent.detach(); // remove this block (practically the next)

                        // read the values of the removed text box, block and the next input box
                        var text_val = $this.val();
                        var val = parent.find( 'input' ).siblings( 'span' ).children().first().val();
                        var input = next.find( 'input' );

                        // set the input value of the next block
                        input
                            .val( text_val + val + input.val() )
                            .setSelection( text_val.length, text_val.length )
                            .focus();

                    }

                });

            var li = $( '<li />' )
                .append( text )
                .append( element );

            return li;

        };

        // first editing block
        container.append( make_block() );

        // focus the last text box
        this.on( 'click', function( ev ) {
            if ( ev.target != that[ 0 ] ) return true;
            container.find( 'input' ).last().focus();
        });

        return this;

    };

    // create the style
    $( 
        '<style>' + 
            'ul.textblocks { padding: 0; margin: 0; list-style: none; }' +
            'ul.textblocks > li { float: left; display: inline; }' + 
            'ul.textblocks > li > input { border: none; outline: none; float: left; } ' + 
        '</style>' 
    ).appendTo( $( 'head' ) );

})( jQuery );

/**
 * jQuery autoGrow extension by Roman Kivalin (https://github.com/rkivalin)
 * https://github.com/rkivalin/jquery-autogrow
 */
(function(){(function(a){var b;return b=["font","letter-spacing"],a.fn.autoGrow=function(c){var d,e,f;return e=c==="remove"||c===!1||(c!=null?!!c.remove:!!void 0),d=(f=c!=null?c.comfortZone:void 0)!=null?f:c,d!=null&&(d=+d),this.each(function(){var c,f,g,h,i,j,k,l,m,n;g=a(this),j=g.next().filter("pre.autogrow");if(j.length&&e)return g.unbind("input.autogrow"),j.remove();if(j.length){i={};for(k=0,m=b.length;k<m;k++)h=b[k],i[h]=g.css(h);j.css(i);if(d!=null)return c=function(){return j.text(g.val()),g.width(j.width()+d)},g.unbind("input.autogrow"),g.bind("input.autogrow",c),c()}else if(!e){g.css("min-width")==="0px"&&g.css("min-width",""+g.width()+"px"),i={position:"absolute",top:-99999,left:-99999,width:"auto",visibility:"hidden"};for(l=0,n=b.length;l<n;l++)h=b[l],i[h]=g.css(h);return j=a('<pre class="autogrow"/>').css(i),j.insertAfter(g),f=d!=null?d:70,c=function(){return j.text(g.val()),g.width(j.width()+f)},g.bind("input.autogrow",c),c()}})}})(typeof Zepto!="undefined"&&Zepto!==null?Zepto:jQuery)}).call(this);

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