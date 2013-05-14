KORDS.TABS.TabsInstance=function()
{
	this.song=new KORDS.TABSDATA.Song;
	this.tabsEditor=new KORDS.TABSEDITOR.Editor(this.song);
}

KORDS.TABS.TabsInstance.prototype = 
{
	load: function(data)
	{
		this.song.load(data);
		if (this.tabsEditor)
		{
			this.tabsEditor.load(this.song);
		}
	},

	reset: function()
	{
		this.song=new KORDS.TABSDATA.Song;
		this.tabsEditor.reset();
	}
}

KORDS.TABSEDITOR.Editor=function(song)
{
	this.song=song;
	this.numSections=0;	
	this.htmlSections=[];
	
	// create element !!!!!!!!!!!!
	this.prettyDivId="pretty-tab";
	this.prettyTabsDiv=document.getElementById(this.prettyDivId);
	
	KORDS.TABSEDITOR.TabsSection.insertTabBlock();
    
	$("#add_text").live("click",function(){
		tabsInstance.tabsEditor.addSection($(this).parents(".tabsection"),'text');
		return false;
	});

	$("#add_tabs").live("click",function(){
		tabsInstance.tabsEditor.addSection($(this).parents(".tabsection"),'tabs');
		return false;
	});
	
	$(".tabblock tr.string td").live('click',function(){
		tabsInstance.tabsEditor.setActiveSection($(this).parents(".tabsection"),$(this));
	});
	
	$(".tabtext").live("focus",function(){
		tabsInstance.tabsEditor.setActiveSection($(this).parents(".tabsection"));
	});
	
	$(".tabtext").live("blur",function(){
		//$(this).parents(".tabsection").removeClass("active");
		//$("#context-menu").hide();
	});

	$("div.tabsection").live({
		mouseenter: function() {
			$(this).removeClass("hover").addClass("hover");
			$(this).find(".tabs-editor-context-menu").show();
			$(this).append($("#context-menu").show());
			if ($(this).hasClass("text"))
				contextMenu.find("#add_text").hide();
			else
				contextMenu.find("#add_text").show();
		},
		mouseleave: function() {
			$(this).removeClass("hover");	
			$("#context-menu").hide();
			//$(this).find(".tabs-editor-context-menu").hide();
		}
	});	
	
	$("#remove_section").live("click",function(){
		tabsInstance.tabsEditor.removeSection($(this).parents(".tabsection"));
	});
}

function getOffsetFromId(id)
{
	var matches = id.match(/\[(.*?)\]/);

	if (matches) 
		return parseInt(matches[1]);
	return -1;
}

KORDS.TABSEDITOR.Editor.prototype = 
{
	reset: function()
	{
		this.numSections=0;	
		this.htmlSections=[];
		
		$("#text-editor-base").append($("#tabs-context-menu").hide());
		$("#text-editor-base").append($("#empty-context-menu").show());

		$("#text-editor").html("");
		$("#pretty-tab").html("");
	},

	appendLoadedSection: function(id,type,data)
	{
		var newId=id;
		var prevId=newId-1;

		var typeNode=$("[id='block']."+type);
		var newNode=typeNode.clone();
		
		var newPrettyNode;
		if (this.numSections==0)
		{
			$("#text-editor").append(newNode);
			newPrettyNode= $('<div data-id="0"></div>');
 			$("#pretty-tab").append(newPrettyNode);
		}
		else
		{
			newPrettyNode=$('<div data-id="'+newId+'"></div>');
			newPrettyNode.insertAfter($("#pretty-tab div[data-id='"+prevId+"']"));
			var obj=$("[id='block["+prevId+"]']");
			newNode.insertAfter(obj);
		}
		
		newPrettyNode=newPrettyNode[0];
		
		newNode.attr("id","block["+this.numSections+"]");
		newNode.attr("data-id",this.numSections);
		newNode.show();
		
		if ($("#empty-context-menu").is(":visible"))
		{
			contextMenu=$("#empty-context-menu").clone();
			contextMenu.attr("id","context-menu");
			contextMenu.show();
			$("#empty-context-menu").hide();				
			contextMenu.find("#remove_section").show();
		}
		else
			contextMenu=$("#context-menu");
		
		var td=null;
		var newSection=null;

		if (type=="text")
		{
			newNode.find("textarea").autosize().focus();
			newSection=new KORDS.TABSEDITOR.TextSection(newNode,newPrettyNode,this,data);
		}
		else if (type=="tabs")
		{
			contextMenu.find("#add_text").show();
			newSection=new KORDS.TABSEDITOR.TabsSection(newNode,newPrettyNode,this,data);
			td=newNode.find("td[data-col='0'][data-row='0']");
		}
		else
		{
			alert("NO TYPE");
		}
		
		//this.song.addSection(newId,newSection.sectionData);
		this.htmlSections.splice(newId,0,newSection);
//		console.log(type,newId,this.htmlSections);

		newNode.append(contextMenu);
		this.reOrderIds();
		this.setActiveSection(newNode,td);
		this.updateText();
		
		this.numSections++;
	},

	load: function(song)
	{
		this.reset();

		this.song=song;
		var len=this.song.sections.length;
		for (var i=0;i<len;i++)
		{
			var section=this.song.sections[i];
			this.appendLoadedSection(i,section.type,section);
		}
	},

	loadFromParser: function(sections)
	{
		var prevNode=null;
		if ($("#empty-context-menu").is(":visible"))
		{
			contextMenu=$("#empty-context-menu").clone();
			contextMenu.attr("id","context-menu");
			contextMenu.show();
			$("#empty-context-menu").hide();				
			contextMenu.find("#remove_section").show();
		}
		
		for (var i=0;i<sections.length;i++)
		{
			console.log(sections[i]);
			var typeNode=$("[id='block']."+sections[i].type);
			var newNode=typeNode.clone();
			
			if (this.numSections==0)
				$("#text-editor").append(newNode);	
			else
				newNode.insertAfter(prevNode);
			
			newNode.attr("id","block["+this.numSections+"]");
			newNode.attr("data-id",this.numSections);
			//newNode.find(".id").html(this.numSections);
			newNode.show();
			newNode.append(contextMenu);
			prevNode=newNode;
			
			if (sections[i].type=="text")
			{
				newNode.find("textarea").val(sections[i].val).autosize();
				this.htmlSections.push(new KORDS.TABSEDITOR.TextSection(newNode,this.updateText));
			}
			else
			{
				for (var j=0;j<sections[i].val.length;j++)
				{
					var rowHtml=newNode.find("tr:eq("+j+")");
					var line=sections[i].val[j];
					for (var k=0;k<line.length;k++)
					{
						var modifiers=['h','p','s','b','v','/','\\'];

						if (line[k]!="-")
						{
							var val=line[k];
							if (modifiers.indexOf(line[k])==-1)
							{
								val=parseInt(line[k],25);
								console.log("NO Está",line[k]);
							}
							else
							{
								console.log("Está",line[k]);
							}
							rowHtml.find("td:eq("+(k+1)+")").html(val);
						}
					}					
				}
				this.htmlSections.push(new KORDS.TABSEDITOR.TabsSection(newNode,this));
			}
			this.numSections++;
		}
	},
	
	setActiveSection: function(sectionHtml,td)
	{
		$(".tabsection.active").find(".active_cell").removeClass("active_cell");
		$(".tabsection.active").find(".active_column").removeClass("active_column");
		$(".tabsection.active").removeClass("active");
		
		sectionHtml.addClass("active");
		
		$("#menu-tabs-text").insertBefore(sectionHtml);
		$("#menu-tabs-text").show();	
				
		if (td)
		{
			var id=sectionHtml.attr("data-id");
			tabsInstance.tabsEditor.htmlSections[id].updateCurrentCursor(td.attr("data-col"),td.attr("data-row"));
		}
		
		if (sectionHtml.hasClass("tabs"))
			$("#tabs-context-menu").show().insertBefore(sectionHtml);
		else
			$("#tabs-context-menu").hide();
	},
	
	onKeyDown: function (e)
	{
		var active=$(".tabsection.active");
		if (active.length > 0){
			var id=getOffsetFromId(active.attr("id"));
			return this.htmlSections[id].onKeyDown(e);
		}
		return true;
	},
	
	paint: function()
	{
		for (var s in tabsInstance.tabsEditor.htmlSections)
			tabsInstance.tabsEditor.htmlSections[s].paint();
	},

	changeSongTitle: function(value)
	{
		if (value=="") value=null;
		this.song.info.title=value;
		$("#title_song").html(value);
		this.updateText();
	},

	changeSongArtist: function(value)
	{
		if (value=="") value=null;
		this.song.info.artist=value;
		$("#title_artist").html(value);
		this.updateText();
	},

	changeSongTranscriber: function(value)
	{
		if (value=="") value=null;
		this.song.info.transcriber=value;
		$("#title_transcriber").html(value);
		this.updateText();
	},

	updateText: function()
	{
		text="";
		if (this.song.info.title!=null)
			text+="SONG: "+this.song.info.title+"\n";

		if (this.song.info.artist!=null)
			text+="ARTIST: "+this.song.info.artist+"\n";

		if (this.song.info.artist!=null)
			text+="TRANSCRIBED BY: "+this.song.info.transcriber+"\n";
		text+="\n";

		for (var i in tabsInstance.tabsEditor.htmlSections)
			text+=tabsInstance.tabsEditor.htmlSections[i].getText()+"\n";
		
		$("#ascii-text").val(text);
		this.paint();
	},

	addSection: function(obj,type)
	{
		var parentId=parseInt(obj.attr("data-id"));
		var newId=isNumber(parentId)?parentId+1:0;

		var typeNode=$("[id='block']."+type);
		var newNode=typeNode.clone();
		
		var newPrettyNode;
		if (this.numSections==0)
		{
			$("#text-editor").append(newNode);
			newPrettyNode= $('<div data-id="0"></div>');
 			$("#pretty-tab").append(newPrettyNode);
		}
		else
		{
			newPrettyNode=$('<div data-id="'+newId+'"></div>');
			newPrettyNode.insertAfter($("#pretty-tab div[data-id='"+parentId+"']"));
			newNode.insertAfter(obj);
		}
		
		newPrettyNode=newPrettyNode[0];
		
		newNode.attr("id","block["+this.numSections+"]");
		newNode.attr("data-id",this.numSections);
		newNode.show();
		
		if ($("#empty-context-menu").is(":visible"))
		{
			contextMenu=$("#empty-context-menu").clone();
			contextMenu.attr("id","context-menu");
			contextMenu.show();
			$("#empty-context-menu").hide();				
			contextMenu.find("#remove_section").show();
		}
		else
			contextMenu=$("#context-menu");
		
		var td=null;
		var newSection=null;

		if (type=="text")
		{
			newNode.find("textarea").autosize().focus();
			newSection=new KORDS.TABSEDITOR.TextSection(newNode,newPrettyNode,this);
		}
		else if (type=="tabs")
		{
			contextMenu.find("#add_text").show();
			newSection=new KORDS.TABSEDITOR.TabsSection(newNode,newPrettyNode,this);
			td=newNode.find("td[data-col='0'][data-row='0']");
		}
		else
		{
			alert("NO TYPE");
		}
		
		this.song.addSection(newId,newSection.sectionData);
		this.htmlSections.splice(newId,0,newSection);
		console.log(type,newId,this.htmlSections);

		newNode.append(contextMenu);
		this.reOrderIds();
		this.setActiveSection(newNode,td);
		this.updateText();

		//newNode[0].scrollIntoView(true);
		//$("#scroll").scrollTo('100%');
		//http://plugins.jquery.com/project/ScrollTo
		$(".hover").removeClass("hover");
		this.numSections++;
	},
	
	removeSection: function(obj)
	{
		var sectionId=obj.attr("data-id");
		
		this.htmlSections[sectionId].removeHtml();
		this.htmlSections.splice(sectionId,1);
		
		this.numSections--;
		
		var next=obj.next();
		if (obj.hasClass("hover"))
		{
			if (next)
			{
				next.addClass("hover");
				next.append($("#context-menu"));
			}
			else
			{
				$("#text-editor").append($("#context-menu"));
			}
		}

		if (obj.hasClass("active"))
		{
			if (next)
				this.setActiveSection(next);
			else
				this.setActiveSection(obj.prev());
		}
		
		obj.remove();
		this.reOrderIds();
		this.updateText();

		if (this.numSections==0)
			$("#empty-context-menu").show();
	},
	
	reOrderIds: function ()
	{
		$(".tabsection:visible").each(function(index,element){
			$(element).attr("id","block["+index+"]");
			$(element).attr("data-id",index);
		});
	}
}

