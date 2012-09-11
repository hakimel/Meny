/*!
 * meny 0.9
 * http://lab.hakim.se/meny
 * MIT licensed
 *
 * Created by Hakim El Hattab, @hakimel, http://hakim.se
 */
var Meny = {
	// Creates a new instance of Meny
	create: function( options ) {
		return (function(){

			// Make sure the required arguments are defined
			if( !options || !options.menuElement || !options.contentsElement ) {
				throw 'You need to specify which menu and contents elements to use.';
				return false;
			}

			// Make sure the menu and contents have the same parent
			if( options.menuElement.parentNode !== options.contentsElement.parentNode ) {
				throw 'The menu and contents elements must have the same parent.';
				return false;
			}

			var VENDORS = [ 'Webkit', 'Moz', 'O', 'ms' ],
				POSITION_TOP = 'top',
				POSITION_RIGHT = 'right',
				POSITION_BOTTOM = 'bottom',
				POSITION_LEFT = 'left';

			var supports3DTransforms =  'WebkitPerspective' in document.body.style ||
										'MozPerspective' in document.body.style ||
										'msPerspective' in document.body.style ||
										'OPerspective' in document.body.style ||
										'perspective' in document.body.style;

			// Extend our config defaults with the options
			var config = {
				width: 300,
				height: 300,
				position: POSITION_LEFT,
				activateThreshold: 40
			};

			// Cache references to DOM elements
			var dom = {
				menuElement: options.menuElement,
				contentsElement: options.contentsElement,
				wrapper: options.menuElement.parentNode,
				cover: null
			};

			var indentX = dom.wrapper.offsetLeft,
				indentY = dom.wrapper.offsetTop,
				touchStartX = null,
				touchMoveX = null,
				isActive = false,
				isMouseDown = false;

			var menuTransformOrigin,
				menuTransformClosed,
				menuTransformOpened,
				contentsTransformOrigin,
				contentsTransformClosed,
				contentsTransformOpened;

			extend( config, options );

			if( supports3DTransforms ) {
				setupTransforms();
				setupWrapper();
				setupCover();
				setupMenu();
				setupContents();

				bindEvents();
			}
			else {
				// JS animation fallback will be added soon
				dom.menuElement.style.display = 'block';
				console.log( 'Your browser doesn\'t support 3D transforms, fallback coming soon.' );
				return false;
			}

			/**
			 * Prepares the transforms for the current positioning 
			 * settings.
			 */
			function setupTransforms() {
				menuTransformOpened = '';
				contentsTransformClosed = '';

				switch( config.position ) {
					case POSITION_TOP:
						menuTransformOrigin = '50% 0%';
						menuTransformClosed = 'rotateX( 30deg ) translateY( -100% ) translateY( 6px )';
						contentsTransformOrigin = '50% 0';
						contentsTransformOpened = 'translateY( '+ config.height +'px ) rotateX( -15deg )';
						break;

					case POSITION_RIGHT:
						menuTransformOrigin = '100% 50%';
						menuTransformClosed = 'rotateY( 30deg ) translateX( 100% ) translateX( -2px ) scale( 1.01 )';
						contentsTransformOrigin = '100% 50%';
						contentsTransformOpened = 'translateX( -'+ config.width +'px ) rotateY( -15deg )';
						break;

					case POSITION_BOTTOM:
						menuTransformOrigin = '50% 100%';
						menuTransformClosed = 'rotateX( -30deg ) translateY( 100% ) translateY( -6px )';
						contentsTransformOrigin = '50% 100%';
						contentsTransformOpened = 'translateY( -'+ config.height +'px ) rotateX( 15deg )';
						break;

					default:
						menuTransformOrigin = '100% 50%';
						menuTransformClosed = 'translateX( -100% ) translateX( 6px ) scale( 1.01 ) rotateY( -30deg )';
						contentsTransformOrigin = '0 50%';
						contentsTransformOpened = 'translateX( '+ config.width +'px ) rotateY( 15deg )';
						break;
				}
			}

			/**
			 * The wrapper element holds the menu and contents.
			 */
			function setupWrapper() {
				addClass( dom.wrapper, 'meny-' + config.position );

				dom.wrapper.style[ prefix( 'perspective' ) ] = '800px';
				dom.wrapper.style[ prefix( 'perspectiveOrigin' ) ] = contentsTransformOrigin;
			}

			/**
			 * The cover is used to obfuscate the contents while 
			 * Meny is open.
			 */
			function setupCover() {
				dom.cover = document.createElement( 'div' );
				dom.cover.style.display = 'block';
				dom.cover.style.position = 'absolute';
				dom.cover.style.width = '100%';
				dom.cover.style.height = '100%';
				dom.cover.style.left = 0;
				dom.cover.style.top = 0;
				dom.cover.style.visibility = 'hidden';
				dom.cover.style.zIndex = 1000;
				dom.cover.style.background = 'rgba( 0, 0, 0, 0.4 )';
				dom.cover.style.background = '-ms-linear-gradient('+ config.position +',  rgba(0,0,0,0.20) 0%,rgba(0,0,0,0.65) 100%)';
				dom.cover.style.background = '-moz-linear-gradient('+ config.position +',  rgba(0,0,0,0.20) 0%,rgba(0,0,0,0.65) 100%)';
				dom.cover.style.background = '-webkit-linear-gradient('+ config.position +',  rgba(0,0,0,0.20) 0%,rgba(0,0,0,0.65) 100%)';
				dom.cover.style.opacity = 0;
				dom.cover.style[ prefix( 'transition' ) ] = 'all .5s ease';
				dom.contentsElement.appendChild( dom.cover );
			}

			/**
			 * The meny element that folds out upon activation.
			 */
			function setupMenu() {
				switch( config.position ) {
					case POSITION_TOP:
						dom.menuElement.style.width = '100%';
						dom.menuElement.style.height = config.height + 'px';
						break;

					case POSITION_RIGHT:
						dom.menuElement.style.right = '0';
						dom.menuElement.style.width = config.width + 'px';
						dom.menuElement.style.height = '100%';
						break;

					case POSITION_BOTTOM:
						dom.menuElement.style.bottom = '0';
						dom.menuElement.style.width = '100%';
						dom.menuElement.style.height = config.height + 'px';
						break;

					case POSITION_LEFT:
						dom.menuElement.style.width = config.width + 'px';
						dom.menuElement.style.height = '100%';
						break;
				}

				dom.menuElement.style.display = 'block';
				dom.menuElement.style.position = 'fixed';
				dom.menuElement.style.zIndex = 1;
				dom.menuElement.style[ prefix( 'transform' ) ] = menuTransformClosed;
				dom.menuElement.style[ prefix( 'transformOrigin' ) ] = menuTransformOrigin;
				dom.menuElement.style[ prefix( 'transition' ) ] = 'all .5s ease';
			}

			/**
			 * The contents element which gets pushed aside while 
			 * Meny is open.
			 */
			function setupContents() {
				dom.contentsElement.style[ prefix( 'transform' ) ] = contentsTransformClosed;
				dom.contentsElement.style[ prefix( 'transformOrigin' ) ] = contentsTransformOrigin;
				dom.contentsElement.style[ prefix( 'transition' ) ] = 'all .5s ease';
			}

			function bindEvents() {
				document.addEventListener( 'mousedown', onMouseDown, false );
				document.addEventListener( 'mouseup', onMouseUp, false );
				document.addEventListener( 'mousemove', onMouseMove, false );
				document.addEventListener( 'touchstart', onTouchStart, false );
				document.addEventListener( 'touchend', onTouchEnd, false );
			}

			function activate() {
				if( !isActive ) {
					isActive = true;

					addClass( dom.wrapper, 'meny-active' );

					dom.cover.style.height = dom.contentsElement.scrollHeight + 'px';
					dom.cover.style.visibility = 'visible';
					dom.cover.style.opacity = 1;

					dom.contentsElement.style[ prefix( 'transform' ) ] = contentsTransformOpened;
					dom.menuElement.style[ prefix( 'transform' ) ] = menuTransformOpened;
				}
			}

			function deactivate() {
				if( isActive ) {
					isActive = false;

					removeClass( dom.wrapper, 'meny-active' );

					dom.cover.style.visibility = 'hidden';
					dom.cover.style.opacity = 0;

					dom.contentsElement.style[ prefix( 'transform' ) ] = contentsTransformClosed;
					dom.menuElement.style[ prefix( 'transform' ) ] = menuTransformClosed;
				}
			}


			/// UTIL: //////////////////////////////////
			

			/**
			 * Extend object a with the properties of object b. 
			 * If there's a conflict, object b takes precedence.
			 */
			function extend( a, b ) {
				for( var i in b ) {
					a[ i ] = b[ i ];
				}
			}

			/**
			 * Prefixes a CSS property with the correct vendor.
			 */
			function prefix( property, el ) {
				var propertyUC = property.slice( 0, 1 ).toUpperCase() + property.slice( 1 );

				for( var i = 0, len = VENDORS.length; i < len; i++ ) {
					var vendor = VENDORS[i];

					if( typeof ( el || document.body ).style[ vendor + propertyUC ] !== 'undefined' ) {
						return vendor + propertyUC;
					}
				}

				return property;
			}

			function addClass( element, name ) {
				element.className = element.className.replace( /\s+$/gi, '' ) + ' ' + name;
			}

			function removeClass( element, name ) {
				element.className = element.className.replace( name, '' );
			}


			/// INPUT: /////////////////////////////////

			function onMouseDown( event ) {
				isMouseDown = true;
			}

			function onMouseMove( event ) {
				// Prevent opening/closing when mouse is down since 
				// the user may be selecting text
				if( !isMouseDown ) {
					var x = event.clientX - indentX,
						y = event.clientY - indentY;

					switch( config.position ) {
						case POSITION_TOP:
							if( y > config.height ) {
								deactivate();
							}
							else if( y < config.activateThreshold ) {
								activate();
							}
							break;

						case POSITION_RIGHT:
							var w = dom.wrapper.offsetWidth;
							if( x < w - config.width ) {
								deactivate();
							}
							else if( x > w - config.activateThreshold ) {
								activate();
							}
							break;

						case POSITION_BOTTOM:
							var h = dom.wrapper.offsetHeight;
							if( y < h - config.height ) {
								deactivate();
							}
							else if( y > h - config.activateThreshold ) {
								activate();
							}
							break;

						case POSITION_LEFT:
							if( x > config.width ) {
								deactivate();
							}
							else if( x < config.activateThreshold ) {
								activate();
							}
							break;
					}
				}
			}

			function onMouseUp( event ) {
				isMouseDown = false;
			}

			function onTouchStart( event ) {
				touchStartX = event.touches[0].clientX - indentX;
				touchStartY = event.touches[0].clientY - indentY;
				touchMoveX = null;
				touchMoveY = null;

				document.addEventListener( 'touchmove', onTouchMove, false );
			}

			function onTouchMove( event ) {
				touchMoveX = event.touches[0].clientX - indentX;
				touchMoveY = event.touches[0].clientY - indentY;

				var swipeMethod = null;

				if( touchMoveX < touchStartX - config.activateThreshold ) {
					swipeMethod = onSwipeRight;
				}
				else if( touchMoveX > touchStartX + config.activateThreshold ) {
					swipeMethod = onSwipeLeft;
				}
				else if( touchMoveY < touchStartY - config.activateThreshold ) {
					swipeMethod = onSwipeDown;
				}
				if( touchMoveY > touchStartY + config.activateThreshold ) {
					swipeMethod = onSwipeUp;
				}

				if( swipeMethod && swipeMethod() ) {
					event.preventDefault();
				}
			}

			function onTouchEnd( event ) {
				document.removeEventListener( 'touchmove', onTouchMove, false );

				// If there was no movement this was a tap
				if( touchMoveX === null && touchMoveY === null ) {
					onTap();
				}
			}

			function onTap() {

			}

			function onSwipeLeft() {
				if( config.position === POSITION_RIGHT && isActive ) {
					deactivate();
					return true;
				}
				else if( config.position === POSITION_LEFT && !isActive ) {
					activate();
					return true;
				}
			}

			function onSwipeRight() {
				if( config.position === POSITION_RIGHT && !isActive ) {
					activate();
					return true;
				}
				else if( config.position === POSITION_LEFT && isActive ) {
					deactivate();
					return true;
				}
			}

			function onSwipeUp() {
				if( config.position === POSITION_BOTTOM && isActive ) {
					deactivate();
					return true;
				}
				else if( config.position === POSITION_TOP && !isActive ) {
					activate();
					return true;
				}
			}

			function onSwipeDown() {
				if( config.position === POSITION_BOTTOM && !isActive ) {
					activate();
					return true;
				}
				else if( config.position === POSITION_TOP && isActive ) {
					deactivate();
					return true;
				}
			}

			
			/// API: ///////////////////////////////////
			
			return {
				activate: activate,
				deactivate: deactivate,

				isActive: function() {
					return isActive;
				}
			};

		})();
	},

	// Helper method, retrieves query string as a key/value hash
	getQuery: function() {
		var query = {};

		location.search.replace( /[A-Z0-9]+?=([\w|:|\/\.]*)/gi, function(a) {
			query[ a.split( '=' ).shift() ] = a.split( '=' ).pop();
		} );

		return query;
	}
};