/*!
 * meny 0.4
 * http://lab.hakim.se/meny
 * MIT licensed
 *
 * Created by Hakim El Hattab, http://hakim.se
 */
(function(){

	var meny = document.querySelector( '.meny' );
	var menyWrapper = meny.parentNode;

	// Avoid throwing errors if the script runs on a page with 
	// no .meny
	if( !meny || !menyWrapper ) { return; }

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

	function activate() {
		if( isActive === false ) {
			isActive = true;

			// Add the meny-active class and clean up whitespace
			document.documentElement.className = document.documentElement.className.replace( /\s+$/gi, '' ) + ' meny-active';
		}
	}

	function deactivate() {
		if( isActive === true ) {
			isActive = false;

			// Remove the meny-active class
			document.documentElement.className = document.documentElement.className.replace( 'meny-active', '' );
		}
	}

})();

