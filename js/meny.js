/*!
 * meny 0.2
 * http://lab.hakim.se/meny
 * MIT licensed
 *
 * Created by Hakim El Hattab, http://hakim.se
 */
(function(){

	var meny = document.querySelector( '.meny' );

	var activateX = 40,
		deactivateX = meny.offsetWidth || 300,
		touchStartX = null,
		touchMoveX = null,
		isActive = false,
		isMouseDown = false;

	document.addEventListener( 'mousedown', onMouseDown, false );
	document.addEventListener( 'mouseup', onMouseUp, false );
	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'touchstart', onTouchStart, false );
	document.addEventListener( 'touchend', onTouchEnd, false );

	function onMouseDown( event ) {
		isMouseDown = true;
	}

	function onMouseMove( event ) {
		// Prevent opening/closing when mouse is down since 
		// the user may be selecting text
		if( !isMouseDown ) {
			var x = event.clientX;

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
		touchStartX = event.touches[0].clientX;
		touchMoveX = null;

		if( isActive || touchStartX < activateX ) {
			document.addEventListener( 'touchmove', onTouchMove, false );
		}
	}

	function onTouchMove( event ) {
		touchMoveX = event.touches[0].clientX;

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
			document.documentElement.classList.add( 'meny-active' );
		}
	}

	function deactivate() {
		if( isActive === true ) {
			isActive = false;
			document.documentElement.classList.remove( 'meny-active' );
		}
	}

})();

