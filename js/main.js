var tabsInstance;
$(document).ready(function(){

	tabsInstance=new KORDS.TABS.TabsInstance();

//	$("#tabs").tabs();

	$("#text").val("");

	$(document).keydown(function(e){
		//console.log(e);
		return tabsInstance.tabsEditor.onKeyDown(e);
	});

	$(document).keydown(function(e){
		//console.log(e);
		//return tabsInstance.tabsEditor.onKeyUp(e);
	});
	
	// Insert chords
	html="";
	for (var chord in chords)
		html+='<option value="'+chord+'">'+chord+'</option>';
	
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
		$("#ktg").val(ktg);
	});

	$("#load_ktb").click(function(){
		//tabsInstance.song.load($("#ktg").val());
		tabsInstance.load($("#ktg").val());
	});

	$("#insert-chords").click(function(){
		var id=parseInt($(".tabsection.active").attr("data-id"));
		tabsInstance.tabsEditor.htmlSections[id].insertChord($("#chords").val());
	});
	
	$(".modifier").click(function(){
		var id=parseInt($(".tabsection.active").attr("data-id"));
		tabsInstance.tabsEditor.htmlSections[id].insertModifier($(this).attr("data-modifier"));
	});
	
	$("#lfingers a").click(function(){
		var id=parseInt($(".tabsection.active").attr("data-id"));
		var finger=$(this).attr("data-modifier").replace("lfinger","");
		tabsInstance.tabsEditor.htmlSections[id].setLFingerValue(finger);
	});
	
	$("#open-tabtext").click(function(){
		var id=parseInt($(".tabsection.active").attr("data-id"));
		tabsInstance.tabsEditor.htmlSections[id].showTextDialog();
	});
	
	$(".colmodifier").click(function(){
		var id=parseInt($(".tabsection.active").attr("data-id"));
		tabsInstance.tabsEditor.htmlSections[id].insertColumnModifier($(this).attr("data-modifier"));
	});

	$("#parse_tab").click(function(){
		var parser=new KORDS.TABS.TabParser($("#text").val());
		tabsInstance.tabsEditor.loadFromParser(parser.parse());
	});
});