var tabsInstance;

function getUrlParams()
{
	var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str,key,value) {
    	params[key] = value;
    });
	return params;
}

function selectActiveTab(tabId)
{
	$(".tab.active").removeClass("active");
	$("section").removeClass("nodisplay").addClass("nodisplay");
	$("section#"+tabId).removeClass("nodisplay");

	//$(".tab")
	//$(this).addClass("active");
	$("a.tab[data-tab='"+tabId+"']").addClass("active");

	$("#ascii-text").trigger('autosize');
	$("#ktg").trigger("autosize");

	if (tabId=="editor")
		$(".active .tabblock").focus();
}


$(document).ready(function(){

	tabsInstance=new KORDS.TABS.TabsInstance();

    params=getUrlParams();
    console.log(params);

    if (params['api-mode']=="editor")
    {
    	tabsInstance.tabsEditor.setEditorMode(true,params['show-song-info']!="false");
    	selectActiveTab("editor");
    }
    else if (params['api-mode']=="viewer")
    {
    	tabsInstance.tabsEditor.setEditorMode(true,params['show-song-info']!="false");
    	$("header").hide();
    }

	$("body").resize(function(){
		window.parent.postMessage({action:"on-resize",height:$(this).height()}, '*');
	});

    //if (params['song-info']=false)
//	$("#tabs").tabs();

	$("#text").val("");
	$("#ascii-text,#ktg").autosize();
/*
	$(document).keydown(function(e){
		//console.log(e);
		return tabsInstance.tabsEditor.onKeyDown(e);
	});
*/


	$(document).on("keydown", ".tabblock,.tabtext", function(e){
		return tabsInstance.tabsEditor.onKeyDown(e);
      //$(this).addClass('active');
    });


/*
	$(document).keydown(function(e){
		//console.log(e);
		//return tabsInstance.tabsEditor.onKeyUp(e);
	});
*/

	$("#songdata #song").change(function(){
		tabsInstance.tabsEditor.changeSongTitle($(this).val());
	});

	$("#songdata #artist").change(function(){
		tabsInstance.tabsEditor.changeSongArtist($(this).val());
	});

	$("#songdata #transcriber").change(function(){
		tabsInstance.tabsEditor.changeSongTranscriber($(this).val());
	});


	// Insert chords
	html="";
	for (var mode in chords)
	{
		html+='<optgroup label="'+mode+'"/>';
		for (var chord in chords[mode])
			html+='<option mode="'+mode+'" value="'+chord+'">'+chord+'</option>';
	}

	$("#chords").html(html);

	$("#new_ktb").click(function(){
		tabsInstance.reset();
	});

	$("#save_ktb").click(function(){
		var ktg=tabsInstance.song.save();
		console.log(ktg);

/*		var fileName="test";
		var blob = new Blob([ktg], {type: "text/plain;charset=utf-8"});
		saveAs(blob, fileName+".ktg");
*/
		$("#ktg").val(ktg).trigger("autosize");
		return false;
	});

	$("#load_ktb").click(function(){
		//tabsInstance.song.load($("#ktg").val());
		tabsInstance.load($("#ktg").val());
		return false;
	});

	$("#insert-chords").click(function(){
		var id=parseInt($(".tabsection.active").attr("data-id"));
		var selected=$("#chords").find(":selected");
		//tabsInstance.tabsEditor.htmlSections[id].insertChord($("#chords").val());
		tabsInstance.tabsEditor.htmlSections[id].insertChord(selected.attr("value"),selected.attr("mode"));
		return false;
	});

	$(".modifier").click(function(){
		var id=parseInt($(".tabsection.active").attr("data-id"));
		tabsInstance.tabsEditor.htmlSections[id].insertModifier($(this).attr("data-modifier"));
		return false;
	});

	$("#lfingers a").click(function(){
		var id=parseInt($(".tabsection.active").attr("data-id"));
		var finger=$(this).attr("data-modifier").replace("lfinger","");
		tabsInstance.tabsEditor.htmlSections[id].setLFingerValue(finger);
		return false;
	});

	$("#open-tabtext").click(function(){
		var id=parseInt($(".tabsection.active").attr("data-id"));
		tabsInstance.tabsEditor.htmlSections[id].showTextDialog();
		return false;
	});

	$(".tab").click(function(){
		var id=$(this).attr("data-tab");
		selectActiveTab(id);
		return false;
	});

	$(".colmodifier").click(function(){
		var id=parseInt($(".tabsection.active").attr("data-id"));
		tabsInstance.tabsEditor.htmlSections[id].insertColumnModifier($(this).attr("data-modifier"));
		return false;
	});

	$("#parse_tab").click(function(){
		var parser=new KORDS.TABS.TabParser($("#text").val());
		tabsInstance.tabsEditor.loadFromParser(parser.parse());
		return false;
	});

	window.addEventListener("message", receiveMessage, false);
	//tabsInstance.load($("#ktg").val());
});

function receiveMessage(event)
{
  	//if (event.origin !== "http://example.org:8080")
    //return;
    // ...
  	if (event.data.action=="get-tabs")
  	{
		var ktg=tabsInstance.song.save();
		event.source.postMessage({action:'return-tabs',tabs:ktg}, '*');
  		//window.parent.postMessage('Hello Parent Frame!', '*');
  	}
  	else if (event.data.action=="load-tabs")
  	{
  		tabsInstance.load(event.data.tabs);
  	}
	console.log(event);
}
