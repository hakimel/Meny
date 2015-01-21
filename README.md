# Meny

A three dimensional and space effecient menu. Meny works best in browsers with support for CSS 3D transforms, although it falls back on 2D animation for older browsers. Supports touch events for mobile devices.

[Check out the demo page](http://lab.hakim.se/meny/).


## Instructions

### 1. Download
Add [meny.js](https://github.com/hakimel/Meny/blob/master/js/meny.js) to your project. The meny.js file is the only thing required, but you could optionally clone the repository if you want to get the default styles.

Alternatively you can load the meny.js file from cdnjs, see <https://cdnjs.com/libraries/meny>.

### 2. Markup
Meny requires two HTML elements to work: a **menu** and the page **contents**. The class names are not used by the library so chose anything you want.

```html
<body>
  <div class="meny">
    <!-- your menu items -->
  </div>
  <div class="contents">
    <!-- your page contents -->
  </div>
</body>
```

Some rules, notes and best practices to keep in mind in terms of markup and styling:
- The **menu** and **contents** should have the same **parent** element.
- The background which appears behind the **contents** when Meny is open is not added by the library. You need to set your desired background to the **parent** element. The default style can be found in [demo.css](https://github.com/hakimel/Meny/blob/master/css/demo.css#L23).
- The arrow which appears when Meny is closed is also not added by the library, if you want it you can easily copy the styles from the demo.css.
- The **menu** container will be automatically resized by the library according to configuration options.
- Meny works on scrolling pages as the menu itself is fixed.


### 3. Initialize
Next you need create an instance of Meny and tell it which HTML elements to use. This should be done after the **meny.min.js** is included on your page. Example using the HTML above:

```javascript
var meny = Meny.create({
	// The element that will be animated in from off screen
	menuElement: document.querySelector( '.meny' ),

	// The contents that gets pushed aside while Meny is active
	contentsElement: document.querySelector( '.contents' ),

	// The alignment of the menu (top/right/bottom/left)
	position: 'left',

	// The height of the menu (when using top/bottom position)
	height: 200,

	// The width of the menu (when using left/right position)
	width: 260,

	// The angle at which the contents will rotate to.
	angle: 30,

	// The mouse distance from menu position which can trigger menu to open.
	threshold: 40,

	// Width(in px) of the thin line you see on screen when menu is in closed position.
	overlap: 6,

	// The total time taken by menu animation.
	transitionDuration: '0.5s',

	// Transition style for menu animations
	transitionEasing: 'ease',

	// Gradient overlay for the contents
	gradient: 'rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.65) 100%)',

	// Use mouse movement to automatically open/close
	mouse: true,

	// Use touch swipe events to open/close
	touch: true
});
```

### 4. API & Events
A few handy methods API methods are included, you call these on the instance returned by ```Meny.create``` (see above).

```javascript
meny.configure({ mouse: false }); // change settings after initialization

meny.open();

meny.close();

meny.isOpen(); // true/false

meny.destroy(); // revert original DOM state, unbind events
```

The wrapper element (parent of the **menu** and **contents**) is decorated with classes based on its state:
```css
.meny-active
.meny-top
.meny-right
.meny-bottom
.meny-left
```

Instances of Meny dispatch events to notify you of their state:

```javascript
var meny = Meny.create( ... ) // see 3. Initialize

meny.addEventListener( 'open', function() {

	// do something on open

} );

meny.addEventListener( 'close', function() {

	// do something on close

} );

meny.addEventListener( 'opened', function() {

	// do something right after meny is opened and transitions finished

} );

meny.addEventListener( 'closed', function() {

	// do something right after meny is closed and transitions finished

} );
```


## History

#### 1.4.0
- Adds `opened` and `closed` events
- Adds `destroy` API method

#### 1.3.0
- Add ```touch``` and ```mouse``` config options
- Fix error with tap to close when meny is on the left
- Add ```configure``` API method for changing settings at runtime

#### 1.2.0
- Improvements to touch interaction
- Setting threshold to 0 disables hover/touch-to-open

#### 1.1.0
- Instances of Meny now dispatch 'open'/'close' events

#### 1.0.0
- 2D animation fallback (works in IE8+)

#### 0.9.0
- Rewrote the JavaScript
- All core styles/transforms are set via JavaScript
- Made many options available at initialization
- New JavaScript fallback using internal animation method

#### 0.3.0
- Fallback mode that doesn't rely on transforms

#### 0.2.0
- Cleaned up CSS
- Fix bug where original events for taps on anchors were blocked
- It's now possible to reach the meny via tapping as well as swiping

#### 0.1.0
- Initial release

## License

MIT licensed

Copyright (C) 2014 Hakim El Hattab, http://hakim.se
