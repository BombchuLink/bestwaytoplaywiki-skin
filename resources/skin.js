( function () {
	'use strict';

	function initAbbrTooltips() {
		document.querySelectorAll( 'abbr[title]' ).forEach( function ( el ) {
			el.setAttribute( 'data-title', el.getAttribute( 'title' ) );
			el.removeAttribute( 'title' );
		} );
	}

	function init() {
		var input = document.querySelector( '.mt-search-wrap input[type="search"]' );
		if ( !input ) {
			return;
		}

		// Placeholder shows only ">" — the animated "_" is a separate overlay
		input.placeholder = '>';

		// Wrap the input so the cursor span can be absolutely positioned inside it
		var wrap = document.createElement( 'div' );
		wrap.className = 'mt-input-wrap';
		input.parentNode.insertBefore( wrap, input );
		wrap.appendChild( input );

		var cursor = document.createElement( 'span' );
		cursor.className = 'mt-prompt-cursor';
		cursor.setAttribute( 'aria-hidden', 'true' );
		cursor.textContent = '_';
		wrap.appendChild( cursor );

		function updateCursor() {
			var hide = document.activeElement === input || input.value !== '';
			cursor.style.visibility = hide ? 'hidden' : 'visible';
		}

		input.addEventListener( 'focus', function () {
			input.placeholder = '';
			updateCursor();
		} );

		input.addEventListener( 'blur', function () {
			if ( !input.value ) {
				input.placeholder = '>';
			}
			updateCursor();
		} );

		input.addEventListener( 'input', updateCursor );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', function () {
			initAbbrTooltips();
			init();
		} );
	} else {
		initAbbrTooltips();
		init();
	}
}() );
