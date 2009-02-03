var Prefs = Components.classes["@mozilla.org/preferences-service;1"]
                   .getService(Components.interfaces.nsIPrefService);
Prefs = Prefs.getBranch("extensions.googlepedia.");


var Overlay = {
  init: function(){
    var ver = -1, firstrun = true;

    var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"]
                            .getService(Components.interfaces.nsIExtensionManager);
    var current = gExtensionManager.getItemForID("{1ABADB6E-DC4B-11DA-9F70-791A9CD9513E}").version;
    //gets the version number.
    //"extension@guid.net" should be replaced with your extension's GUID.
		
    try{
	ver = Prefs.getCharPref("version");
	firstrun = Prefs.getBoolPref("firstrun");
    }catch(e){
      //nothing
    }finally{
      if (firstrun){
        Prefs.setBoolPref("firstrun",false);
        Prefs.setCharPref("version",current);
	
        // Insert code for first run here        

        // The example below loads a page by opening a new tab.
        // Useful for loading a mini tutorial
        window.setTimeout(function(){
          gBrowser.selectedTab = gBrowser.addTab("http://googlepedia.googlecode.com/svn/pages/first-run.html");
        }, 1500); //Firefox 2 fix - or else tab will get closed
				
      }		
      
      if (ver!=current && !firstrun){ // !firstrun ensures that this section does not get loaded if its a first run.
        Prefs.setCharPref("version",current);
        
        window.setTimeout(function(){
          gBrowser.selectedTab = gBrowser.addTab("http://googlepedia.googlecode.com/svn/pages/updated.html");
        }, 1500); //Firefox 2 fix - or else tab will get closed
					
        // Insert code if version is different here => upgrade
      }
    }
    window.removeEventListener("load",function(){ Overlay.init(); },true);
  }
};


window.addEventListener("load",function(){ Overlay.init(); },true);

