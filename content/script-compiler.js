
var googlepedia_gmCompiler={

// getUrlContents adapted from Greasemonkey Compiler
// http://www.letitblog.com/code/python/greasemonkey.py.txt
// used under GPL permission
//
// most everything else below based heavily off of Greasemonkey
// http://greasemonkey.mozdev.org/
// used under GPL permission

getUrlContents: function(aUrl){
	var	ioService=Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService);
	var	scriptableStream=Components
		.classes["@mozilla.org/scriptableinputstream;1"]
		.getService(Components.interfaces.nsIScriptableInputStream);

	var	channel=ioService.newChannel(aUrl, null, null);
	var	input=channel.open();
	scriptableStream.init(input);
	var	str=scriptableStream.read(input.available());
	scriptableStream.close();
	input.close();

	return str;
},

isGreasemonkeyable: function(url) {
	var scheme=Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService)
		.extractScheme(url);
	return (
		(scheme == "http" || scheme == "https" || scheme == "file") &&
		!/hiddenWindow\.html$/.test(url)
	);
},

contentLoad: function(e) {
	var unsafeWin=e.target.defaultView;
	if (unsafeWin.wrappedJSObject) unsafeWin=unsafeWin.wrappedJSObject;

	var unsafeLoc=new XPCNativeWrapper(unsafeWin, "location").location;
	var href=new XPCNativeWrapper(unsafeLoc, "href").href;

	if (
		googlepedia_gmCompiler.isGreasemonkeyable(href)
		&& ( /http:\/\/www\.google\..*\/search.*q=.*/.test(href) )
		&& true
	) {
		var script=googlepedia_gmCompiler.getUrlContents(
			'chrome://googlepedia/content/googlepedia.js'
		);
		googlepedia_gmCompiler.injectScript(script, href, unsafeWin);
	}
},

injectScript: function(script, url, unsafeContentWin) {
	var sandbox, script, logger, storage, xmlhttpRequester;
	var safeWin=new XPCNativeWrapper(unsafeContentWin);

	sandbox=new Components.utils.Sandbox(safeWin);

	var storage=new googlepedia_ScriptStorage();
	xmlhttpRequester=new googlepedia_xmlhttpRequester(
		unsafeContentWin, window//appSvc.hiddenDOMWindow
	);

	var stringsBundle = document.getElementById("string-bundle-googlepedia");

	sandbox.window=safeWin;
	sandbox.document=sandbox.window.document;
	sandbox.unsafeWindow=unsafeContentWin;

	// patch missing properties on xpcnw
	sandbox.XPathResult=Components.interfaces.nsIDOMXPathResult;

	// add our own APIs
	sandbox.GM_addStyle=function(css) { googlepedia_gmCompiler.addStyle(sandbox.document, css) };
	sandbox.GM_setValue=googlepedia_gmCompiler.hitch(storage, "setValue");
	sandbox.GM_getValue=googlepedia_gmCompiler.hitch(storage, "getValue");
	sandbox.GM_openInTab=googlepedia_gmCompiler.hitch(this, "openInTab", unsafeContentWin);
	sandbox.GM_xmlhttpRequest=googlepedia_gmCompiler.hitch(
		xmlhttpRequester, "contentStartRequest"
	);
	sandbox.getString=function(key){ return stringsBundle.getString(key); };
	//unsupported
	sandbox.GM_registerMenuCommand=function(){};
	sandbox.GM_log=function(){};

	sandbox.__proto__=sandbox.window;

	try {
		this.evalInSandbox(
			"(function(){"+script+"})()",
			url,
			sandbox);
	} catch (e) {
		var e2=new Error(typeof e=="string" ? e : e.message);
		e2.fileName=script.filename;
		e2.lineNumber=0;
		//GM_logError(e2);
		//alert(e2);
	}
},

evalInSandbox: function(code, codebase, sandbox) {
	if (Components.utils && Components.utils.Sandbox) {
		// DP beta+
		Components.utils.evalInSandbox(code, sandbox);
	} else if (Components.utils && Components.utils.evalInSandbox) {
		// DP alphas
		Components.utils.evalInSandbox(code, codebase, sandbox);
	} else if (Sandbox) {
		// 1.0.x
		evalInSandbox(code, sandbox, codebase);
	} else {
		throw new Error("Could not create sandbox.");
	}
},

openInTab: function(unsafeContentWin, url) {
	var unsafeTop = new XPCNativeWrapper(unsafeContentWin, "top").top;

	for (var i = 0; i < this.browserWindows.length; i++) {
		this.browserWindows[i].openInTab(unsafeTop, url);
	}
},

hitch: function(obj, meth) {
	if (!obj[meth]) {
		throw "method '" + meth + "' does not exist on object '" + obj + "'";
	}

	var staticArgs = Array.prototype.splice.call(arguments, 2, arguments.length);

	return function() {
		// make a copy of staticArgs (don't modify it because it gets reused for
		// every invocation).
		var args = staticArgs.concat();

		// add all the new arguments
		for (var i = 0; i < arguments.length; i++) {
			args.push(arguments[i]);
		}

		// invoke the original function with the correct this obj and the combined
		// list of static and dynamic arguments.
		return obj[meth].apply(obj, args);
	};
},

onLoad: function() {
	var	appcontent=window.document.getElementById("appcontent");
	if (appcontent && !appcontent.greased_googlepedia_gmCompiler) {
		appcontent.greased_googlepedia_gmCompiler=true;
		appcontent.addEventListener("DOMContentLoaded", googlepedia_gmCompiler.contentLoad, false);
	}
},

onUnLoad: function() {
	//remove now unnecessary listeners
	window.removeEventListener('load', googlepedia_gmCompiler.onLoad, false);
	window.removeEventListener('unload', googlepedia_gmCompiler.onUnLoad, false);
	window.document.getElementById("appcontent")
		.removeEventListener("DOMContentLoaded", googlepedia_gmCompiler.contentLoad, false);
}

}; //object googlepedia_gmCompiler


function googlepedia_ScriptStorage() {
	this.prefMan=new googlepedia_PrefManager();
}
googlepedia_ScriptStorage.prototype.setValue = function(name, val) {
	this.prefMan.setValue(name, val);
}
googlepedia_ScriptStorage.prototype.getValue = function(name, defVal) {
	return this.prefMan.getValue(name, defVal);
}


window.addEventListener('load', googlepedia_gmCompiler.onLoad, false);
window.addEventListener('unload', googlepedia_gmCompiler.onUnLoad, false);
