


/**
 * A component used for recieving data via JSONP
 * @return {void}
 * @constructor
 */
var reach = function() {
  this.increment_ = reach.increment_++;
};


/**
 * Static increment
 * Distinguishes global callbacks for multiple requests
 * @type {number}
 * @private
 */
reach.increment_ = 0;


/**
 * The increment of this JSONP component
 * This is initialized in the constructor
 * Do not set it yourself
 * @type {number=}
 * @private
 */
reach.prototype.increment_;


/**
 * Get the increment of this JSONP component
 * There is no setter. Do not attempt to set this.
 * @return {number}
 */
reach.prototype.increment = function() {
  return this.increment_;
};


/**
 * Static list of global callbacks, referenced by unique increment
 * Array-like object
 * @type {Object}
 */
reach.callbacks = {};


/**
 * Get or set the callback function associated with this JSONP request
 * @param {function=} opt_set
 * @return {function|reach}
 */
reach.prototype.callback = function(opt_set) {
  if (arguments.length) {
    reach.callbacks[this.increment()] = opt_set;
    return this;
  }
  return reach.callbacks[this.increment()];
};


/**
 * The URL to request data from
 * Make sure you trust this source!
 * JSONP is a hack to get around a very important modern security feature
 * @type {?string}
 * @private
 */
reach.prototype.url_ = null;


/**
 * Get or set the URL
 * This is the *base* URL; set arguments with `.arguments()`
 * @param {?string=} opt_set
 * @return {?string|reach}
 */
reach.prototype.url = function(opt_set) {
  if (arguments.length) {
    this.url_ = opt_set || null;
    return this;
  }
  return this.url_;
};


/**
 * The arguments to send in the request
 * @type {object=}
 * @private
 */
reach.prototype.arguments_;


/**
 * Get or set the arguments to send in the request
 * @param {object=} opt_set
 * @return {object|reach}
 */
reach.prototype.arguments = function(opt_set) {
  if (arguments.length) {
    // this does not overwrite wholesale
    // rather, it adds to existing arguments
    this.arguments_ = this.arguments_ || {};
    for (var i in opt_set) {
      this.arguments_[i] = opt_set[i];
    }
    return this;
  }
  // todo: dereference this for safety
  return this.arguments_ || {};
};


/**
 * JSON-ify an item/argument
 * If you have your own JSON library (vs polyfill),
 * add it in this function
 * @param {mixed} item
 * @return {?string}
 */
reach.stringify = function(item) {
  if (window.JSON) {
    return window.JSON.stringify(item);
  }

  // this is where you'd add your library
  // if you have jQuery JSON, for example:
  /*if (window.$ && window.$.toJSON) {
    return window.$.toJSON(item);
  }*/

  return null;
};


reach.stringify_polyfill_ = function(item) {
  // todo
};


/**
 * Prototype version
 * Just calls the static method
 * @param {mixed} item
 * @return {?string}
 */
reach.prototype.stringify = function(item) {
  return reach.stringify(item);
};


/**
 * The name of the argument that specifies a callback
 * This shouldn't need to be changed, as by convention,
 * most sites that deal with JSONP call it "callback"
 * However, we never know when we will deal with someone who
 * hates standardization
 * @type {string}
 * @private
 */
reach.prototype.parameter_ = 'callback';


/**
 * Get/set the argument name that specifies a callback function
 * You shouldn't have to use this but once in a blue moon, if ever
 * @param {string=} opt_set
 * @return {string|reach}
 */
reach.prototype.parameter = function(opt_set) {
  if (arguments.length) {
    this.parameter_ = opt_set;
    return this;
  }
  return this.parameter_;
};


/**
 * Simple way to keep track of if a request was sent
 * The only thing I use it for is throwing errors if you attempt to double-send
 * If you're reading this, you probably have another use for it;
 * I included `.sent()` below as a public getter
 * @type {boolean}
 * @private
 */
reach.prototype.sent_ = false;


/**
 * Returns whether or not the request was sent
 * Getter only; I set this internally
 * @return {boolean}
 */
reach.prototype.sent = function() {
  return this.sent_;
};


/**
 * Sends the JSONP request
 * Call this only after everything is sent, and only once!
 * @return {reach}
 */
reach.prototype.send = function() {
  if (this.sent_) {
    throw 'JSONP Request already sent!';
  }

  var url = this.url();
  if (!url) {
    throw 'URL is required to send a JSONP request';
  }

  var arguments = this.arguments();
  if (this.callback()) {
    arguments[this.parameter()] = (
      'reach.callbacks[' + this.increment() + ']'
    );
  }

  var serial = [];
  for (var arg in arguments) {
    serial.push(
      encodeURIComponent(arg) + '=' +
      encodeURIComponent(arguments[arg])
    );
  }

  if (serial.length) {
    url = url + '?' + serial.join('&');
  }

  var head = document.head;
  if (!head) {
    throw 'Document seems to have been decapitated (missing <head>)';
  }

  // after using libraries for dom access, this feels icky...
  var script = document.createElement('script');
  script['type'] = 'text/javascript';
  script['src'] = url;

  // adding these in to make debugging easier in the DOM
  // "Where did this random <script> come from?"
  // this is not a question you want to leave unanswered
  if (script['dataset']) {
    script['dataset']['requestSource'] = 'reach';
    script['dataset']['increment'] = this.increment();
    script['dataset']['timestamp'] = (
      Math.floor(Date.now() / 1000)
    );
  }

  // moment of truth!
  head.appendChild(script);

  // mark this as sent
  this.sent_ = true;

  return this;
};


