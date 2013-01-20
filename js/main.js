if (!String.prototype.trim) {
	//String.prototype.trim=function(){return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');};
	//String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g, '');};
}

String.prototype.removeCharAt = function (index) {
	return this.substr(0, index) + this.substr(index +1);
}

function cleanLine(line)
{
	line=line.replace(/\|/g,'');
	line=line.substring(line.indexOf("-"));
	return line.trim();
}
	
String.prototype.replaceAt=function(index, char) {
      return this.substr(0, index) + char + this.substr(index+char.length);
}
   
function isEmptyCol(lines,i)
{
	for (var j=0;j<lines.length;j++)
		if (lines[j][i]!='-')
			return false;
	
	return true;
}
	
var tabsInstance;
$(document).ready(function(){

	tabsInstance=new KORDS.TABS.TabsInstance();

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
	/*
	$(".buttoncheck").click(function(){
		$(this).toggleClass("checked");
	});
	*/
	$("#parse_tab").click(function(){
		var parser=new KORDS.TABS.TabParser($("#text").val());
		tabsInstance.tabsEditor.loadFromParser(parser.parse());
	});
	
	
});