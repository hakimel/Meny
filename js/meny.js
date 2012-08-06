/*!
 * meny 0.1
 * http://lab.hakim.se/meny
 * MIT licensed
 *
 * Created by Hakim El Hattab, http://hakim.se
 */
(function(){

	var activateX = 40,
		deactivateX = 300,
		startTouchX = 0,
		isActive = false;

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'touchstart', onTouchStart, false );

	function onMouseMove( event ) {
		var x = event.clientX,
			y = event.clientY;

		if( isActive && x > deactivateX ) {
			deactivate();
		}
		else if( !isActive && x < activateX ) {
			activate();
		}
	}

	function onTouchStart( event ) {
		lastTouchX = event.touches[0].clientX;

		if( event.target.nodeName !== 'A' && ( isActive || lastTouchX < activateX ) ) {
			event.preventDefault();

			document.addEventListener( 'touchmove', onTouchMove, false );
			document.addEventListener( 'touchend', onTouchEnd, false );
		}
	}

	function onTouchMove( event ) {
		var x = event.touches[0].clientX;

		if( isActive && x < lastTouchX - activateX ) {
			deactivate();
		}
		else if( !isActive && lastTouchX < activateX && x > lastTouchX + activateX ) {
			activate();
		}
	}

	function onTouchEnd( event ) {
		document.addEventListener( 'touchmove', onTouchMove, false );
		document.addEventListener( 'touchend', onTouchEnd, false );
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

