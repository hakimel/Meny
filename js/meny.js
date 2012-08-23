/*!
 * meny 0.5
 * http://lab.hakim.se/meny
 * MIT licensed
 *
 * Created by Hakim El Hattab, http://hakim.se
 */
(function(){

	var meny = document.querySelector( '.meny' );

	// Avoid throwing errors if the script runs on a page with 
	// no .meny
	if( !meny || !meny.parentNode ) { return; }

	var menyWrapper = meny.parentNode;
	
	// Add a class to identify the parent of the meny parts
	menyWrapper.className += ' meny-wrapper';

	var indentX = menyWrapper.offsetLeft,
		activateX = 40,
		deactivateX = meny.offsetWidth || 300,
		touchStartX = null,
		touchMoveX = null,
		isActive = false,
		isMouseDown = false;

	var supports3DTransforms = 'WebkitPerspective' in document.body.style ||
								'MozPerspective' in document.body.style ||
								'msPerspective' in document.body.style ||
								'OPerspective' in document.body.style ||
								'perspective' in document.body.style;

	document.addEventListener( 'mousedown', onMouseDown, false );
	document.addEventListener( 'mouseup', onMouseUp, false );
	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'touchstart', onTouchStart, false );
	document.addEventListener( 'touchend', onTouchEnd, false );
	window.addEventListener( 'hashchange', onHashChange, false );

	onHashChange();

	// Fall back to more basic CSS
	if( !supports3DTransforms ) {
		document.documentElement.className += ' meny-no-transform';
	}

	document.documentElement.className += ' meny-ready';

	function onMouseDown( event ) {
		isMouseDown = true;
	}

	function onMouseMove( event ) {
		// Prevent opening/closing when mouse is down since 
		// the user may be selecting text
		if( !isMouseDown ) {
			var x = event.clientX - indentX;

			if( x > deactivateX ) {
				deactivate();
			}
			else if( x < activateX ) {
				activate();
			}
		}
	}

	function onMouseUp( event ) {
		isMouseDown = false;
	}

	function onTouchStart( event ) {
		touchStartX = event.touches[0].clientX - indentX;
		touchMoveX = null;

		if( isActive || touchStartX < activateX ) {
			document.addEventListener( 'touchmove', onTouchMove, false );
		}
	}

	function onTouchMove( event ) {
		touchMoveX = event.touches[0].clientX - indentX;

		if( isActive && touchMoveX < touchStartX - activateX ) {
			deactivate();
			event.preventDefault();
		}
		else if( touchStartX < activateX && touchMoveX > touchStartX + activateX ) {
			activate();
			event.preventDefault();
		}
	}

	function onTouchEnd( event ) {
		document.addEventListener( 'touchmove', onTouchMove, false );

		// If there was no movement this was a tap
		if( touchMoveX === null ) {
			// Hide the menu when tapping on the content area
			if( touchStartX > deactivateX ) {
				deactivate();
			}
			// Show the meny when tapping on the left edge
			else if( touchStartX < activateX * 2 ) {
				activate();
			}
		}
	}

	function onHashChange( event ) {
		if( window.location.hash.match( 'fold' ) && !document.body.className.match( 'meny-fold' ) ) {
			addClass( document.body, 'meny-fold' );

			var clone = document.createElement( 'div' );
			clone.className = 'meny right';
			clone.innerHTML = meny.innerHTML + '<div class="cover"></div>';
			document.body.appendChild( clone );

			addClass( meny, 'left' );
		}
		else {
			removeClass( document.body, 'meny-fold' );

			var clone = document.querySelector( '.meny.right' );

			if( clone ) {
				clone.parentNode.removeChild( clone );
			}
		}
	}

	function activate() {
		if( isActive === false ) {
			isActive = true;
			addClass( document.documentElement, 'meny-active' );
		}
	}

	function deactivate() {
		if( isActive === true ) {
			isActive = false;
			removeClass( document.documentElement, 'meny-active' );
		}
	}

	function addClass( element, name ) {
		element.className = element.className.replace( /\s+$/gi, '' ) + ' ' + name;
	}

	function removeClass( element, name ) {
		element.className = element.className.replace( name, '' );
	}

})();

