(function(window) {

    var $TS = window.$TS = function(selector) {
        return new $TS.fn.init(selector);
    };

    $TS.fn = $TS.prototype = {
        constructor: $TS,

        length: 0,

        readyList: [],

        isReady: false,

        val: function() {
            var args = Array.prototype.slice.call(arguments);
            if (args.length) {
                this[0].setValue(args[0].toString());
                return this;
            }

            return this[0].getValue();
        },

        init: function(selector) {
            var i = 1,
                item;

            // $TS()
            if (!selector) {
                return this;
            }


            // $TS(function() {...})
            if (typeof selector === 'function') {
                this.ready(selector);
                return this;
            }


            // $TS(IWItem)
            if (typeof selector === 'object' && selector.constructor === IWItem) {
                this[0] = selector;
                this.length = 1;

                return this;
            }


            // $TS('/photos/photo')
            if ( selector.indexOf('*') === -1 && (item = IWDatacapture.getItem(selector)) !== null ) {

                this[0] = item;
                this.length = 1;
                return this;


            // $TS('/photos/photo[*]/image')
            } else {

                while ( (item = IWDatacapture.getItem(selector.replace(/\*/g, i))) !== null ) {
                    this[i-1] = item;
                    this.length += 1;
                    i += 1;
                }

            }

            return this;
        },

        index: function() {
            var re = /\[(\d+)\]/i,
                name = this[0].getName(),
                matches = name.match(re);

            if (matches instanceof Array && matches.length === 2) {
                return matches[1];
            } else {
                return null;
            }
        },

        name: function() {
            return this[0].getName();
        },

        each: function(callback) {
            var i = 0,
                prop;

            for (prop in this) {
                if ( !isNaN(prop) && this.hasOwnProperty(prop) ) {
                    callback.call(this[prop], i++);
                }
            }

            return this;
        },


        // Internal method called when a TeamSite form is initialized
        _onFormReady: function() {
            var i = ($TS.fn.readyList.length - 1);

            $TS.fn.isReady = true;

            // Loop through subscribed functions and execute (FIFO)
            for (; i >= 0; i--) {
                $TS.fn.readyList[i]();
            }
        },


        /**
         * Add functions to be called when the form is initialized
         */
        ready: function(fn) {
            if (typeof fn !== 'function') {
                return;
            }

            // If called after onFormInit, run immediately
            if ($TS.fn.isReady) {
                fn();
                return;
            }

            $TS.fn.readyList.push(fn);
        },

        _eventMap: {},
        _eventInitiators: {},

        _setupEvent: function(itemName, eventName) {
            if (!itemName || !eventName) {
                return;
            }

            if ( !$TS.fn._eventMap[itemName] ) {
                $TS.fn._eventMap[itemName] = {};
            }

            if ( typeof $TS.fn._eventMap[itemName][eventName] === 'undefined' ) {
                $TS.fn._eventMap[itemName][eventName] = [];
            }

            if (!$TS.fn._eventInitiators[itemName]) {
                $TS.fn._eventInitiators[itemName] = {};
            }

            if (typeof $TS.fn._eventInitiators[itemName][eventName] !== 'function') {
                $TS.fn._eventInitiators[itemName][eventName] = function( itemObj ) {
                    var eventList = $TS.fn._eventMap[itemName][eventName],
                        len = eventList.length,
                        i = 0;

                    for (; i < len; i++) {
                        eventList[i]( itemObj );
                    }
                };
            }
        },

        // Attach an event handler to one or more items
        on: function( eventName, handler ) {

            // Reasons to do nothing
            if (!this.length || typeof eventName !== 'string' || !handler || typeof handler !== 'function') {
                return this;
            }

            // We only need to attach an event to a single item
            if (this.length === 1) {
                var itemName = this[0].getName();

                this._setupEvent(itemName, eventName);

                $TS.fn._eventMap[itemName][eventName].push(handler);

                IWEventRegistry.addItemHandler(itemName, eventName, $TS.fn._eventInitiators[itemName][eventName]);
            }

            // Multiple items
            if (this.length > 1) {
                this.each(function(i, v) {
                    $TS.fn._setupEvent(v.getName(), eventName);

                    $TS.fn._eventMap[v.getName()][eventName].push(handler);

                    IWEventRegistry.addItemHandler(v.getName(), eventName, $TS.fn._eventInitiators[v.getName()][eventName]);
                });
            }

            return this;
        }
    };

})(window);

$TS.fn.init.prototype = $TS.fn;

IWEventRegistry.addFormHandler('onFormInit', $TS.fn._onFormReady);
IWDatacapture.enableImagePreview(true);

