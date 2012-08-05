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
		isActive = false;

	window.addEventListener( 'mousemove', onMouseMove, false );
	window.addEventListener( 'touchmove', onTouchMove, false );

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

	function onTouchMove( event ) {

	}

	function activate() {
		isActive = true;
		document.documentElement.classList.add( 'meny-active' );
	}

	function deactivate() {
		isActive = false;
		document.documentElement.classList.remove( 'meny-active' );
	}

})();

