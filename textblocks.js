/**
 *
 *
 *
 */
(function( $ ) {

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
                    var val = $this.val();

                    // dynamic width
                    // TODO: Make it smarter. Set the value into a temporary text field, set its 'size' attribute and then read the width attribute
                    $this.css( 'width', ( 3 + ( 13 * val.length ) ) );

                    // dynamic position
                    var height_compare = parent;
                    var next = parent.next();
                    if ( !element && next.length ) {
                        height_compare = next;
                    }
                    height_compare = height_compare.children().first();

                    var top = parseInt( height_compare.css( 'margin-top' ) ) + 
                        ( ( height_compare.innerHeight() - $this.innerHeight() ) / 2 );

                    $this.css( 'top', top + 'px' );

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
                    
                    // move backwards (left-arrow or backspace)
                    if ( 0 == text[ 0 ].selectionStart && ( 8 == ev.keyCode || 37 == ev.keyCode ) ) {

                        var parent = $( this ).parent();
                        var prev = parent.prev(), val;

                        // remove previous (backspace)?
                        if ( 8 == ev.keyCode && parent.siblings().length ) {

                            val = parent.prev().attr( 'data-value' ); // + parent.find( 'input[ type="text" ]' ).val();
                            parent.prev().detach();
                            ev.preventDefault();

                        }

                        // jump backwards
                        var input = parent.find( 'input[ type="text" ]' )
                        val && ( input.val( val + input.val() ) );
                        
                        input.focus();

                    }

                    // move forward (right-arrow or delete)
                    if ( $( this ).val().length == text[ 0 ].selectionEnd && ( 46 == ev.keyCode || 39 == ev.keyCode ) ) {

                        var parent = $( this ).parent();
                        var next = parent.next();

                        // remove next (delete)
                        if ( 46 == ev.keyCode ) {
                            var val = next.attr( 'data-value' );
                            next.detach();
                            $( this ).val( $( this ).val() + val ).focus();
                        } else {
                            next.find( 'input[ type="text" ]' )
                                .focus();
                        }



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

})( jQuery )