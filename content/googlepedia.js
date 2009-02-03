// Googlepedia
// 
// Copyright (c) 2006-2008, James Hall
// Feel free to share, modify, sell etc...

var googleUrl = window.location.href.match(/http:\/\/(.*?)\//);
googleUrl = 'http://'+googleUrl[1]+'/';
var googleTld = window.location.href.match(/http:\/\/(.*?)\.google\.(.*?)\/(.*?)/);
var wikipediaLanguage;

if (GM_getValue('language') == '') {
	var googleLanguage = getQueryVariable('hl');
	
	if (googleLanguage == '') {
		googleLanguage = 'en';
	}
	
	// Wikipedia doesn't appear to have Traditional and Simplified versions
	if (googleLanguage == 'zh-CN' || googleLanguage == 'zh-TW') {
		googleLanguage = 'zh';
	}
	
	if (googleLanguage == 'de-DE' || googleLanguage == 'de-AT' || googleLanguage == 'de-CH') {
		googleLanguage = 'de';
	}
	
	if (googleLanguage == 'pt-BR' || googleLanguage == 'pt-PT') {
		googleLanguage = 'pt';
	}
	
	wikipediaLanguage = googleLanguage;
} else {
	wikipediaLanguage = GM_getValue('language');
}

var wikipediaUrl = 'http://' + wikipediaLanguage + '.wikipedia.org/' 

var Images = {
	throbber: 'data:image/gif;base64,R0lGODlhEAAQAPMAAP%2F%2F%2F2Zm%2F4uL%2FtfX%2FpWV%2Fq6u%2FuPj%2Fra2%2FsfH%2Fuvr%2FszM%2FtjY%2FvHx%2Ftvb%2FgAAAAAAACH%2BFU1hZGUgYnkgQWpheExvYWQuaW5mbwAh%2BQQBAAAAACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAAEPBDISau9dggxMBVBIHgTKJKSxpFGURgoUBBEEc913L6xlCCIRAxxOCCGRQRjsWBgfsGFQrGISamxZdMSAQAh%2BQQACgABACwAAAAAEAAQAAAEPhDIOYQYM2sRgtCTURQG54FSQRBFdaGAysKZSNJAgiAJLiGHA8IHAAqJOh5RwlgsGMSFQrGITqu%2B5nPJ7UYAACH5BAAKAAIALAAAAAAQABAAAAQ%2BEMhpSjEz60JI0VOCIAnnDYIwZMhxINUlBIHAukg215lIZiiVhLFYMECghUKxQGqUTGeGaJRar9isdst1RgAAIfkEAAoAAwAsAAAAABAAEAAABD4QyJkQSjNrdA7SE7MsDOcZRWFki6Is1VUQRMG6SzbXmUhmKBVoCBgIBANiRhAICJQTphMqMSKp2Kx2y91GAAAh%2BQQACgAEACwAAAAAEAAQAAAEPRDIydZiM%2Bul1NIgwHkJgiQhUF3IcSBp1r7xVJ51ZhSFkQMFAqHwCw5%2Fu15tIBAMfoJAQACVUnNM528biwAAIfkEAAoABQAsAAAAABAAEAAABDwQyEmrvdiytViei6IsnxSOJbB1qZQgSJIix4HM9V2%2B8WcUBUOqQCAUMAOBYEA0YgSBgOAXfEYFqeTSEgEAIfkEAAoABgAsAAAAABAAEAAABDwQyEmrvTjrzbufzLIw3KIoS3mmWzhKgyAMVIIgCSUEgUAhhwNCxxMYCgUDUEiJzQoEQsGGw0ClnGPSEgEAIfkEAAoABwAsAAAAABAAEAAABDsQyEmrvTjrzXsdgjBwQhAIpIluoOgZRWFQzLIwVEEQBbUoikVuV0ggEIlfkAKTIQ4HRO2GeUY5RqQlAgA7AAAAAAAAAAAA',
	networkError: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8%2F9hAAAABGdBTUEAALGPC%2FxhBQAAAAlwSFlzAAALEgAACxIB0t1%2B%2FAAAAAd0SU1FB9YCERABCn8%2BTScAAAIVSURBVDjLjZNfSJNRGMZ%2FZ%2Fs%2BkmQDJ4RCG0s2QYpACFIyKxhi0ZV2N7sIBhldRKCRdGEM77oqI4QuVhdFwpC6CiRyoGt0I6sMDPozjakf%2Bg1pbc7NndPFYLXSj967w%2FPyvOf3nPcI9qjw2GgU6Me6JjQLsb8n0Ivf37qraBgG0anJQSsD%2FP5Wzgbv7KpNP7sJgKWBEAKArq6jgAIq57m590gpKwZWrPcf3OV81z6KwmDJrCe%2FtU02V6jp0f6TlY3NynS7pgOglPqNYMX69OoJ3A8jeNJrAGQcB5j1nay5wZ6sKjLOh1CE7kAAp9sNwObyModmZkiOjICnuTZEu93G2voP8lvb7P%2FykXPmJ7qvXEaZJuXFRaRSOBsa6AwGmX38CEfn8UiNwcLnVVCV6afeTXOstwe1vs7O6ipSSpSUlNJpbMUih0%2BfIfs2cUn7MxAzbVTNnBvfcXouoN8YRtd1hIBKm0IIgQyPob94XkEwDIOXT4ZrwnvlGUfpOgiBECClrL69EIJSJlMNcSI6NTn4d%2FoHG12YySSOgYvkEglkqYQsl5FSornd5F0u7MXSGw0YvH5tiEKhdkEyR9pZCIVo7%2BhANDVRTqeRgL25GVtLC9%2Fi8ZyEWxrAysrKvwvQ1kZDXx%2Fz0Shen496rxcF%2FDRNUvF4biefvzcAMREeG1VW%2F6Hua4rG1zHqUktZABvMl%2BH2AMQAfgGt5toAC2JPDAAAAABJRU5ErkJggg%3D%3D'
}

function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head)
	{
		return;
	}
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

// Thanks to Pete Freitag for this very useful function
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return ''; 
}

// Remove Google adwords

(function () {
	// Thanks to Max Kueng (http://maxkueng.com/) for this next bit
	var f = document.getElementsByTagName('font');
	for (var i=0;i<f.length;i++) {
		if (f[i].className == 'a') {
			t = f[i].parentNode.parentNode.parentNode.parentNode.parentNode;
			t.style.display = 'none';
		}
	}
	
	// New top Adword removal code
	// Uses color to make it MUCH less likely a dom change will remove the
	// wrong element
	var d = document.getElementsByTagName('div');
	for (var i=0;i<d.length;i++) {
		if(d[i].id == 'tpa1') {
			//alert(d[i].style.backgroundColor);
		}
		if (d[i].style.backgroundColor == 'rgb(229, 236, 249)' || d[i].style.backgroundColor ==	'rgb(255, 249, 221)') {
			d[i].style.display = 'none';
		}
	}	
	
	// More adword removal...
	var mbEnd = document.getElementById('mbEnd');
	if(mbEnd != undefined) {
		mbEnd.style.display = 'none';
	}
	
	var tads = document.getElementById('tads');
	if(tads != undefined) {
		tads.style.display = 'none';
	}	
	
}());

var allElements, thisElement, wikibox;
allElements = document.getElementsByTagName('a');
for (var i = 0; i < allElements.length; i++) {
	thisElement = allElements[i];
	if(thisElement.className == 'l') {
		var firstLink = thisElement;
		i = allElements.length;
	}
}

function retrieveURL(url) {
	GM_xmlhttpRequest({
		method: 'GET',
		url: url,
		headers: {
			'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
			'Accept': 'application/atom+xml,application/xml,text/xml'
		},
		onload: function(responseDetails) {
			articleLoaded = true;
			wikibox.innerHTML = responseDetails.responseText;

			if(document.getElementById('content')) {
				wikibox.innerHTML = boxhtml + document.getElementById('content').innerHTML;
				if(getQueryVariable('anchor') != "") {
					document.location.href = document.location.href + '#' + getQueryVariable('anchor');
				}
				document.getElementById('hideLink').addEventListener("mousedown", function(e) {
					document.getElementById('showGooglepediaBox').style.display='block';
					document.getElementById('wikibox').style.display='none';
					GM_setValue('hidden', '1');
				}, false);				
			} else {
				wikibox.innerHTML = getString('noArticleFound');
			}
			
			var rewriteLinks = GM_getValue('rewrite_links');
			var header = wikibox.getElementsByTagName('h1')[0];
				
			header.innerHTML = header.innerHTML + ' <a class="linkBack" href="' + url.replace(/"/g, '%22') + '">(' + getString('viewOnWikipedia') + ')</a>';
				
			var allLinks, allImages, thisElement;
			allLinks = wikibox.getElementsByTagName('a');
			for (var i = 0; i < allLinks.length; i++) {
				thisElement = allLinks[i];
				var thisHref = thisElement.href;
				if(thisHref.match('Image:')) {
					thisHref = thisHref.replace(/http:\/\/(.*).google.(.*)\/wiki\//,wikipediaUrl+"wiki/");
					//var urlSplit = thisHref.split('/');
					//thisHref = thisHref.replace(urlSplit[urlSplit.length - 1], '');
				} else if(thisHref.match('#')) {
					//http://www.google.com/
					if(thisHref.match(/http:\/\/(.*).google.(.*)\/wiki\//)) {
						//alert('yes');
						if(rewriteLinks) {
							thisHref = thisHref.replace(/http:\/\/(.*).google.(.*)\/wiki\/(.*)#(.*)/, googleUrl+"search?hl="+googleLanguage+"&wikititle=1&q=$3&anchor=$4");
						} else {
							thisHref = thisHref.replace(/http:\/\/(.*).google.(.*)\/wiki\//, wikipediaUrl+"wiki/");
						}
						// TODO: Make sure anchored links work when page title has more than one keyword
							
					}
					//Internal link
				} else if(thisHref.match('/w/index.php')) {
					thisHref = thisHref.replace(/http:\/\/(.*).google.(.*)\/w\//,wikipediaUrl+"w/")
				} else {
					if(rewriteLinks) {
						var originalHref = thisHref;
						var newHref = thisHref.replace(/http:\/\/(.*).google.(.*)\/wiki\//,googleUrl+"search?hl="+googleLanguage+"&wikititle=1&q=");
							
						if(originalHref != newHref) {
							newHref = newHref.replace(/_/g, ' ');
						}
							
						thisHref = newHref;
							
					} else {
						thisHref = thisHref.replace(/http:\/\/(.*).google.(.*)\/wiki\//, wikipediaUrl+"wiki/");
					}
				}
					
				thisElement.href = thisHref;
			}
				
			allImages = wikibox.getElementsByTagName('img');
			for (var i = 0; i < allImages.length; i++) {
				thisElement = allImages[i]; 
				if(thisElement.src == googleUrl + 'skins-1.5/common/images/magnify-clip.png') {
					thisElement.src = wikipediaUrl + 'skins-1.5/common/images/magnify-clip.png'
				} else {
					// Direct links to full-sized images
					var realImage = thisElement.src;
					realImage = realImage.replace(/thumb\//, '');
					realImage = realImage.replace(/\/[^\/.]+$/, '');
					var imageSplit = realImage.split('/');
					realImage = realImage.replace('/' + imageSplit[imageSplit.length - 1], '');
					thisElement.parentNode.href = realImage;
				}
				 
			}					
								
		}
	});
}


addGlobalStyle('#wikibox { z-index: 999; background-color: #fff; overflow: hidden; position: relative; top: 20px;	}');
addGlobalStyle('#showGooglepediaBox { z-index: 999; float: right; width: 50%; text-align: right; display:none; position: relative; top: 20px;	}');

var start = getQueryVariable('start');
if(GM_getValue('hidden', '0')=='1' || (start != '' && start != '0')) {
	addGlobalStyle('#showGooglepediaBox { display:block;font-size:13px !important}');
}

addGlobalStyle('#hideLink { float: right; }');
addGlobalStyle('.shrunk { float: right; width: 50%; border-left: 3px solid #efefef; padding-left: 10px; margin-left: 10px; margin-bottom: 32px; }');
addGlobalStyle('.expanded { float: none; width: 100%; border: 0; padding: 0; border-bottom: 3px solid #efefef; padding-bottom: 10px; margin-bottom: 30px;}');
addGlobalStyle('#throbber, #networkError { vertical-align:middle; padding-right: 10px; }');
addGlobalStyle('#navbar { text-align: left; width: 50%;	} hr { width: 45% !important; } ');

// Wikipedia CSS
//addGlobalStyle('.infobox{float:right;}#jump-to-nav{display:none;}#bc table,#bc td,#bc div,#bc nobr,#bc font,#bc input,#bc a{font-family:Arial, Helvetica, sans-serif !important;font-size:12px;font-weight:400;color:#000;cursor:default;line-height:1.6em;}#bc a{cursor:pointer;color:#003FBF !important;text-decoration:none;}#bc a:hover{text-decoration:underline;}#bc h1.firstHeading{font-size:260%;font-family:Arial, Helvetica, sans-serif;color:#000;margin:10px 0 2px;}#bc h3#siteSub{font-size:130%;color:#CCC;margin:0 0 20px;}#bc h1{font-size:200%;}#bc h4{font-size:150%;margin-bottom:0;#bch4a font-size:100%;}#bc .navcontent{display:block;}#bc #catlinks{border-top:1px solid #DDE5F9;border-left:1px solid #DDE5F9;border-right:1px solid #BCC2D0;border-bottom:1px solid #BCC2D0;background:url(../pix/mediabg.png) #FFF repeat-x top left;padding:2px 10px;}#bc #catlinks p{margin:0;}#toc{border:1px solid #DBDFE6;background-color:#F0F2F5;}#toctitle h2{font-size:140%;padding-left:10px;}#toctitle TD{padding-top:16px;}#tocinside TD{padding:10px 20px 20px;}div.thumb{border:1px solid #CCC;background-color:#F9F9F9;width:auto;margin:20px;padding:4px;}div.tright{clear:right;float:right;}.internal IMG{border:1px solid #CCC;}.thumbcaption{padding:6px 4px 4px;}.tocline{font-size:12pt;}.tocindent{padding-left:20px;}.toctext{padding-left:7px;}img,#bc a img{border:0;}#bc h2,#bc h2 a{font-size:150%;}');
//addGlobalStyle('#bc table,#bc td,#bc div,#bc nobr,#bc font,#bc input,#bc a{font-family:Arial, Helvetica, sans-serif !important;font-size:10px;}IMG{border:1px solid #CCC;}.thumbcaption{padding:6px 4px 4px;}.tocline{font-size:12pt;}.tocindent{padding-left:20px;}.toctext{padding-left:7px;}img,#bc a img{border:0;}#bc h2,#bc h2 a{font-size:150%;}');

// Styles lovingly handpicked from the wikipedia site then compressed. Some heavy tweaking in places
addGlobalStyle('h1.firstHeading{clear:both;}#wikibox img{border:0 !important}#wikibox,#wikibox ul{font-size:13px !important}.infobox{ border:1px solid #aaa; background-color:#f9f9f9; color:black; margin-bottom:0.5em; margin-left:1em; padding:0.2em; float:right; clear:right}.infobox td,.infobox th{ vertical-align:top}.infobox caption{ font-size:larger; margin-left:inherit}.infobox.bordered{ border-collapse:collapse}.infobox.bordered td,.infobox.bordered th{ border:1px solid #aaa}.infobox.bordered .borderless td,.infobox.bordered .borderless th{ border:0}.infobox.sisterproject{ width:20em; font-size:90%}.infobox.bordered .mergedtoprow td,.infobox.bordered .mergedtoprow th{ border:0; border-top:1px solid #aaa; border-right:1px solid #aaa}.infobox.bordered .mergedrow td,.infobox.bordered .mergedrow th{ border:0; border-right:1px solid #aaa}.infobox.geography{ border:1px solid #ccd2d9; text-align:left; border-collapse:collapse; line-height:1.2em; font-size:90%}.infobox.geography td,.infobox.geography th{ border-top:solid 1px #ccd2d9; padding:0.4em 0.2em 0.4em 0.8em}.infobox.geography .mergedtoprow td,.infobox.geography .mergedtoprow th{ border-top:solid 1px #ccd2d9; padding:0.4em 0.2em 0.2em 0.8em}.infobox.geography .mergedrow td,.infobox.geography .mergedrow th{ border:0; padding:0 0.2em 0.2em 0.8em}.infobox.geography .mergedbottomrow td,.infobox.geography .mergedbottomrow th{ border-top:0; border-bottom:solid 1px #ccd2d9; padding:0 0.2em 0.4em 0.8em}.infobox.geography .maptable td,.infobox.geography .maptable th{ border:0; padding:0 0 0 0}#toc a{text-decoration:none}#toc,.toc,.mw-warning{border:1px solid #aaa;background-color:#f9f9f9;padding:5px;font-size:95%}#toc h2,.toc h2{display:inline;border:none;padding:0;font-size:100%;font-weight:bold}#toc #toctitle,.toc #toctitle,#toc .toctitle,.toc .toctitle{text-align:center}#toc ul,.toc ul{list-style-type:none;list-style-image:none;margin-left:0;padding-left:0;text-align:left}#toc ul ul,.toc ul ul{margin:0 0 0 2em}#toc .toctoggle,.toc .toctoggle{font-size:94%}div.thumb{margin-bottom:.5em;border-style:solid;border-color:white;width:auto}div.thumb div{border:1px solid #ccc;padding:3px !important;background-color:#f9f9f9;font-size:94%;text-align:center;overflow:hidden}div.thumb div a img{border:1px solid #ccc}div.thumb div div.thumbcaption{border:none;text-align:left;line-height:1.4em;padding:.3em 0 .1em 0}div.magnify{float:right;border:none !important;background:none !important}div.magnify a,div.magnify img{display:block;border:none !important;background:none !important}div.tright{clear:right;float:right;border-width:.5em 0 .8em 1.4em;font-size:13px;text-decoration:none}div.tleft{float:left;margin-right:.5em;border-width:.5em 1.4em .8em 0}.hiddenStructure{display:none;speak:none}img.tex{vertical-align:middle}span.texhtml{font-family:serif}img{border:none;vertical-align:middle}p{margin:.4em 0 .5em 0;line-height:1.5em}p img{margin:0}hr{height:1px;color:#aaa;background-color:#aaa;border:0;margin:.2em 0 .2em 0}#wikibox h1,#wikibox h2,#wikibox h3,#wikibox h4,#wikibox h5,#wikibox h6{color:black;background:none;font-weight:normal;margin:0;padding-top:.5em;padding-bottom:.17em;border-bottom:1px solid #aaa}h1{font-size:188%}h2{font-size:150%}#wikibox	h3,#wikibox h4,#wikibox h5,#wikibox h6{border-bottom:none;font-weight:bold}#wikibox h3{font-size:132%}#wikibox h4{font-size:116%}#wikibox h5{font-size:100%}#wikibox h6{font-size:80%}#wikibox ul{line-height:1.5em;list-style-type:square;margin:.3em 0 0 1.5em;padding:0;list-style-image:url(bullet.gif)}#wikibox ol{line-height:1.5em;margin:.3em 0 0 3.2em;padding:0;list-style-image:none}#wikibox li{margin-bottom:.1em}#wikibox dt{font-weight:bold;margin-bottom:.1em}#wikibox dl{margin-top:.2em;margin-bottom:.5em}#wikibox dd{line-height:1.5em;margin-left:2em;margin-bottom:.1em}#wikibox #catlinks{border:1px solid #aaa;background-color:#f9f9f9;padding:5px;margin-top:1em;clear:both}#wikibox table.rimage{float:right;position:relative;margin-left:1em;margin-bottom:1em;text-align:center}#wikibox .toccolours{border:1px solid #aaa;background-color:#f9f9f9;padding:5px;font-size:95%}div.townBox{position:relative;float:right;background:white;margin-left:1em;border:1px solid gray;padding:.3em;width:200px;overflow:hidden;clear:right}div.townBox dl{padding:0;margin:0 0 .3em;font-size:96%}div.townBox dl dt{background:none;margin:.4em 0 0}div.townBox dl dd{margin:.1em 0 0 1.1em;background-color:#f3f3f3}#siteNotice div{text-align:center !important;font-size:100%}.references-small *{font-size:11px}.tright a{text-decoration:none;font-size:13px !important}#jump-to-nav{display:none}a.new,#quickbar a.new{color:#C20} #siteSub{ display:inline; font-size:92%; font-weight:normal} #siteNotice{font-size:14px !important} #siteSub{display:block;padding-top:4px;margin-bottom:15px}.editsection{display:none;}a.linkBack{font-size:0.4em;font-weight:normal;}');
addGlobalStyle('ol.references li { list-style-type: decimal !important; }');

wikibox = document.createElement('div');
showGooglepediaBox = document.createElement('div'); 

var originalContent;
var showGooglepedia;

var boxhtml = '<a id=\'expandLink\' href="#" onmousedown="document.getElementById(\'wikibox\').className=\'expanded\'; document.getElementById(\'shrinkLink\').style.display=\'inline\'; document.getElementById(\'expandLink\').style.display=\'none\'; return false;" style="float: left;">&lsaquo; ' + getString('expand') + '</a>'
		+ '<a id=\'shrinkLink\' href="#" onmousedown="document.getElementById(\'wikibox\').className=\'shrunk\'; document.getElementById(\'expandLink\').style.display=\'inline\'; document.getElementById(\'shrinkLink\').style.display=\'none\';	return false;" style="display:none; float: left;">' + getString('shrink') + ' &rsaquo;</a>'
		+ '<a id=\'hideLink\' href="#" id="hideLink">' + getString('hide') + ' &raquo;</a>';

var showGooglepedia = '<a id="showLink" href="#">&laquo; Googlepedia</a>';
var debugLink = '<a onclick="document.innerHTML = \'<text\'+\'area>\'+document.innerHTML+\'</text\'+\'area>\';">Debug</a>';
var networkError = '<img id="networkError" src="'+Images.networkError+'" />' + getString('networkProblem');
var results = document.getElementById('res');



window.initWikibox = function () {
	var articleLoaded = false;

	if(getQueryVariable('wikititle') == '1') {
		// For those queries when you don't feel so lucky[tm]
		retrieveURL(wikipediaUrl+'wiki/'+getQueryVariable('q').replace(/%20/g, '_'));
	} else {
		// TODO: Make this a preference?
		var noSpecialPages = true;
		var url = '';
		// Possible talk / special page fix
		//google talk site:http://en.wikipedia.org/wiki -inurl:User: -inurl:Talk: -inurl:"User_talk:" -inurl:"Template:" -inurl:"Template_talk:" 
		if(noSpecialPages) {
			var specialPageRemove = '+-inurl:"User:"+-inurl:Talk:+-inurl:"User_talk:"+-inurl:"Template:"+-inurl:"Template_talk:"';
			var url = googleUrl+'search?q='+getQueryVariable('q')+'+site:'+wikipediaUrl+'wiki' + specialPageRemove + '&btnI=I%27m+Feeling+Lucky';		
		} else {
			url = googleUrl+'search?q='+getQueryVariable('q')+'+site:'+wikipediaUrl+'wiki&btnI=I%27m+Feeling+Lucky';
		}
		retrieveURL(url);
		//unsafeWindow.console.log(url);
	}
	
	window.checkLoaded = function () {
		if(articleLoaded==false) {
			document.getElementById('wikibox').innerHTML = networkError;
		}
	}
	wikibox.innerHTML = '<img id="throbber" src="'+Images.throbber+'" />' + getString('loadingArticlePleaseWait');
	wikibox.id = 'wikibox';
	wikibox.className = 'shrunk';

	//if(results[0]) {
		results.parentNode.insertBefore(wikibox, results);
	//}
}

// Only show Wikibox if on first page, and not hidden
if(GM_getValue('hidden', '0') == '0' && (start == '' || start == 0)) {
	initWikibox();
}

showGooglepediaBox.id = 'showGooglepediaBox';
showGooglepediaBox.innerHTML = showGooglepedia;

//if(allParagraphs[0]) {
results.parentNode.insertBefore(showGooglepediaBox, results);
//}

document.getElementById('showLink').addEventListener("mousedown", function(e) {

	if(!document.getElementById('wikibox')) {
		initWikibox();
	}
	
	GM_setValue('hidden', '0');
	
	document.getElementById('showGooglepediaBox').style.display='none';
	document.getElementById('wikibox').style.display='block';
}, false);
				
var brTags = document.getElementsByTagName('br')
var doNextBr = false;

for (var i = 0; i < brTags.length; i++) {
	if(brTags[i].getAttribute('clear') == 'all') {
		brTags[i].setAttribute('clear', 'none');
		i = brTags.length;
	}
}

if(document.getElementById('navbar')) {
	document.getElementById('navbar').innerHTML = document.getElementById('navbar').innerHTML + '<br clear=all />';
}
