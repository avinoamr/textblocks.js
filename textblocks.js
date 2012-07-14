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
            var fn = settings.fn || function( block ) { return $( '<span>' + block + '</span>' ) };

            // TODO: add support for a delimiter function (default delimiter is a simple split)
            var delimiter = ( 'function' == typeof settings.delimiter ) ? settings.delimiter : function( text ) {

                return text.split( settings.delimiter || ' ' );

            };

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
                    var top = ( ( height_compare.height() - $this.height() ) / 2 ) - 1;
                    $this.css( 'top', top )

                    // create the blocks
                    var block_values = delimiter( val );
                    if ( 1 >= block_values.length ) return; // no delimiter found, no changes require.

                    var after = parent;
                    for ( var i = 0 ; i < block_values.length - 1 ; i ++ ) {
                        var block_value = block_values[ i ];

                        // create & insert the new block element
                        after = make_block( fn( block_value ).css( 'float', 'left' ), block_value )
                                    .insertAfter( after );

                    }

                    // clear up the text boxes and focus on next text box
                    $this.val( '' );
                    after.find( 'input' )
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
                            val = parent.attr( 'data-value' ) + parent.find( 'input[ type="text" ]' ).val();
                            parent.detach();
                            ev.preventDefault();
                        }

                        // jump backwards
                        var input = prev.find( 'input[ type="text" ]' )

                        val && ( input.val( input.val() + val ) );
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
                .append( element )
                .append( text );

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