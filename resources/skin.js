( function () {
	'use strict';

	function initAbbrTooltips() {
		var abbrs = document.querySelectorAll( 'abbr[title]' );
		if ( !abbrs.length ) {
			return;
		}

		// Suppress native browser tooltips by moving title → data-title
		abbrs.forEach( function ( el ) {
			el.setAttribute( 'data-title', el.getAttribute( 'title' ) );
			el.removeAttribute( 'title' );
		} );

		// Single fixed-position overlay — appended to <body> so no overflow
		// ancestor can clip or scroll it.
		var tip = document.createElement( 'div' );
		tip.className = 'mt-abbr-tooltip';
		tip.setAttribute( 'aria-hidden', 'true' );
		document.body.appendChild( tip );

		abbrs.forEach( function ( el ) {
			el.addEventListener( 'mouseenter', function () {
				tip.textContent = el.getAttribute( 'data-title' );
				tip.style.display = 'block';

				var rect = el.getBoundingClientRect();
				var tipW = tip.offsetWidth;
				var tipH = tip.offsetHeight;
				var gap  = 7;

				var left = rect.left + rect.width / 2 - tipW / 2;
				var top  = rect.top - tipH - gap;

				// Flip below if not enough room above
				if ( top < 8 ) {
					top = rect.bottom + gap;
				}

				// Clamp horizontally inside the viewport
				left = Math.max( 8, Math.min( left, window.innerWidth - tipW - 8 ) );

				tip.style.left = left + 'px';
				tip.style.top  = top  + 'px';
			} );

			el.addEventListener( 'mouseleave', function () {
				tip.style.display = 'none';
			} );
		} );
	}

	function wrapTables() {
		document.querySelectorAll( '.mw-parser-output table.wikitable' ).forEach( function ( table ) {
			if ( table.parentNode.classList.contains( 'mt-table-scroll' ) ) {
				return;
			}
			var wrap = document.createElement( 'div' );
			wrap.className = 'mt-table-scroll';
			table.parentNode.insertBefore( wrap, table );
			wrap.appendChild( table );
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
			wrapTables();
			init();
		} );
	} else {
		initAbbrTooltips();
		wrapTables();
		init();
	}
}() );
