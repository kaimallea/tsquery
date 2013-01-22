tsQuery
=======

tsQuery is a JavaScript library that wraps around the TeamSite FormAPI to simplify item addressing and event handling for rapid data capture form development.

<hr/>

## Features

- jQuery-like syntax

- `.ready` method for registering multiple functions to be called when the data capture form is fully initialized

		$TS.ready(function() {
			console.log('Form ready for manipulation');
		});

		// Shorter version
		$TS(function() {
			console.log('Form ready for manipulation');
		});

- Simplified item addressing

		// Select the image item from the 2nd photo replicant,
		// which itself is in a 'photos' container
		$TS('/photos/photo[2]/image');

- Multiple item addressing

		// The number of image replicants is arbitrary,
		// but there's a special selector to select them all
		$TS('/photos/photo[*]/image');

- Simplified event management via `.on()`

		// Add a handler to each photo replicant, listening
		// for changes to the slug field
		$TS('/photos/photo[*]/slug').on('onItemChange', function( index ) {

			console.log( this.getValue() ); // 'this' is automatically bound to selected IWItem

			console.log( $TS(this).val() ); // another way; turn it into a tsQuery object and call .val()
		});

<hr/>

## Usage

Include tsQuery inside `datacapture.cfg`:

	<script src="/path/to/tsquery.js"></script>

Obviously, it must be included before any scripts that depend on it.

Any subsequent scripts using tsQuery as a dependency should use `$TS.ready()` or `$TS()` to ensure that code is executed after form initialization:

	$TS(function() {
		// .. your code ..
	});

<hr/>

__NOTE:__ _This library only works within a data capture form context. It expects certain global IW* object and functions to exist, which are always available in form contexts_

## Building

Building with [GruntJS](http://gruntjs.com) is not required, but if you have it, you can simply run `grunt` from within the project directory to generate a linted, minified version at `./build/tsquery.min.js`

