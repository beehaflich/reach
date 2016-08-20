# reach

JSONP made simple.

`reach.js` exists solely to send JSONP requests without the use of any other libraries or plugins.

### What is JSONP? Is it JSON?

JSONP stands for "JSON with Padding", and is a hack to get around cross-origin restrictions. Basically, you dynamically load a script from a completely separate website. You send variables using GET, so all complex variables are "stringified" via JSON.

### What are cross-origin restrictions? Why would I want to avoid them?

A client browser cannot send XMLHttpRequests to a server on a different origin (usually domain). This is a safety feature at heart, and prevents scripts from different websites from sending data back-and-forth easily from the client.

What you *can* do is load an entire script voluntarily from another site in a `<script>` tag (similar to direct-linking an image or loading a font directly from a hosting service's website). The server takes your GET parameters tacked onto the URL, uses them to load whatever data it needs from its servers, dynamically creates a javascript file (that calls your callback at the end), and echoes it back to the browser.

### Why wouldn't I use JSONRequest or CORS?

Maybe you need to support older tech, or the server you want to connect do happens to only use JSONP.

JSONP is a consequence of how the `<script>` tag works, and doesn't require much to get set up. If you're only sending strings and numbers, you don't even need the browser to support the JSON object.

It's basically the PHP of cross-origin requests. It's dead easy to set up and runs on everything, but has some potential negative security implications. Make the best choice for your situation.

### Why can't the servers just talk to each other?

Sometimes you want to make sure data doesn't ever touch your server - for example, some portions of credit card data that you want to keep off to ensure PCI compliance.

Maybe the server you are trying to reach is owned by someone who prefers to echo JavaScript instead of talking to other servers.

### Why might I want to *not* use JSONP?

You must, by the nature of cross-domain requests, *absolutely trust* the site you are sending the request to. You are handing them information and allowing them to run a script on your client. This is not trivial.

This also sends a GET request to the website, which you might prefer not to use.

### How does this code help?

The `reach` class is a wrapper to automatically construct the `<script>` element and attach it to the document with a minimum of fuss. It easily handles multiple requests, automatic callback aliasing, and encoding the component arguments.

See the test HTML/JS files in the `test` directory for examples.

### What prerequisites do I need? What conflicts might this have?

There are no JS library prerequisites. I've written it vanilla for compatibility and simplicity.

In order to use the JSON stringification, you will either need to guarantee the client browser has access to the JSON object (polyfills are ok), send in pre-stringified arguments, or edit my code slightly to include whatever library or code you wish to use. Most sites are OK with this browser requirement; JSON has been supported for awhile.

I use one global object - `reach` - so it should not conflict with any javascript that does not alter this global variable. If anyone ever chooses to use this and requests a no-conflict mode, I will add it.

My test runner uses jQuery.

### I can't run the non-control tests?

Make sure your host can execute the test files (apache is running, permissions set, etc). You can do this on your local machine through tools like XAMPP or WAMPServer if you do not have access to a dedicated webserver.

Note: For now I just have a simple PHP test script; I may later include different server-side languages as a coding exercise.

### How do I include this in my website?

You only need one file. Choose between `reach.js` and `reach-min.js`, depending on how much fiddling you intend to do. If you want to plug-and-play and keep your site speedy, choose the minified version. If you are going to play around with the code or need to debug, go with the non-minified version.

### Can I make a request?

Absolutely. Submit a bug, feature request, or pull request via GitHub.









