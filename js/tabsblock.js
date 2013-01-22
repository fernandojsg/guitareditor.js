var tabBlockLength=40; //@todo Put in php constant
var tabBlockText="";
var tabBlockNotes=["E","B","G","D","A","E"];
var tabBlockNumStrings=tabBlockNotes.length;
var topColumnModifiers=["text","accents","arrows"];
var bottomColumnModifiers=["rfingers"];

var TYPE_NOTE=0;
var TYPE_LFINGER=1;
var EMPTY_NOTE="";
var EMPTY_NOTE_HTML="";

var chords={
	"A": "002220",
	"A#":"688766",
	"B": "799877",
	"C": "032010",
	"C#":"99ABB9",
	"D": "XX0232",
	"D#":"BBCDDB",
	"E": "022100",
	"F": "133211",
	"F#":"244322",
	"G": "320003",
	"G#":"466544"
};

KORDS.TABS.TabsBlock=function(htmlNode,prettyHtmlNode,tabsEditorInstance)
{
	this.htmlNode=htmlNode;
	
	this.tabsEditorInstance=tabsEditorInstance;
	
	this.type="tabs";
	this.updateText();	

	this.data={
				"strings":new Array(tabBlockNumStrings),
				"colmodifiers":{},
			};

	for (var i=0;i<tabBlockNumStrings;i++)
	{
		this.data['strings'][i]={};
/*		
		for (var j=0;j<tabBlockLength;j++)
		{
			this.data['strings'][i][j]=new Array(EMPTY_NOTE,"");
		}
*/		
	}

		
	for (var i=0;i<topColumnModifiers.length;i++)
	{
		this.data['colmodifiers'][topColumnModifiers[i]]={"nummodifiers":0,"values":new Array(tabBlockLength)};
		for (var j=0;j<tabBlockLength;j++)
			this.data['colmodifiers'][topColumnModifiers[i]]['values'][j]=null;
	}
	
	for (var i=0;i<bottomColumnModifiers.length;i++)
	{
		this.data['colmodifiers'][bottomColumnModifiers	[i]]={"nummodifiers":0,"values":new Array(tabBlockLength)};
		for (var j=0;j<tabBlockLength;j++)
			this.data['colmodifiers'][bottomColumnModifiers	[i]]['values'][j]=null;
	}

	this.div = prettyHtmlNode;
	this.canvas=new KORDS.TABS.TabsCanvasPainter(this.div,this);
	
	this.updateText();
}

KORDS.TABS.TabsBlock.prototype = 
{
	removeHtml: function()
	{
		console.log("removing html");
		this.div.parentNode.removeChild(this.div);
	},

	getData: function()
	{
		return this.data;
	},
	
	insertSpaceAtPos: function(col,row)
	{
		for (var i=tabBlockLength-1;i>=col;i--)
			this.setStringCellValue(i,row,this.getCellValue(i-1,row),TYPE_NOTE);
		this.setStringCellValue(col,row,EMPTY_NOTE,TYPE_NOTE); //??????????? null
	},
	
	insertSpace: function(wholeColumn)
	{
		var curCell=$(".tabblock td.active_cell",this.htmlNode);
		var col=parseInt(curCell.attr("data-col"));
		var row=parseInt(curCell.attr("data-row"));

		if (wholeColumn)
		{
			for (var i=0;i<tabBlockNumStrings;i++)
				this.insertSpaceAtPos(col,i);
			
			var curCol=$(".tabblock td[data-col="+col+"]",this.htmlNode);
			curCol.html(EMPTY_NOTE_HTML);
		}
		else
		{
			this.insertSpaceAtPos(col,row);
			curCell.html(EMPTY_NOTE_HTML);
		}
		this.updateText();
	},
	
	removeSpaceAt: function (col,row)
	{
		for (var i=col+1;i<tabBlockLength;i++)
			this.setStringCellValue(i-1,row,this.getCellValue(i,row),TYPE_NOTE);
		this.setStringCellValue(tabBlockLength-1,row,EMPTY_NOTE,TYPE_NOTE);
	},

	setLFingerValue: function(value,col,row)
	{
		if (typeof col=="undefined" || typeof row=="undefined")
		{
			var curCell=$(".tabblock td.active_cell",this.htmlNode);
			col=parseInt(curCell.attr("data-col"));
			row=parseInt(curCell.attr("data-row"));
		}
	
		if (this.getStringCellValue(col,row)!=EMPTY_NOTE)
		{
			this.setStringCellValue(col,row,value,TYPE_LFINGER);
			this.updateText();
			this.updateLFingerButtons(col,row);
		}
	},
	removeSpace: function(wholeColumn)
	{
		var curCell=$(".tabblock td.active_cell",this.htmlNode);
		var col=parseInt(curCell.attr("data-col"));
		var row=parseInt(curCell.attr("data-row"));
		if (wholeColumn)
		{
			for (var i=0;i<tabBlockNumStrings;i++)
				this.removeSpaceAt(col,i);
		}
		else
		{
			this.removeSpaceAt(col,row);
		}
		
		this.updateText();
	},

	onKeyDown: function (e)
	{
		var keys=new KORDS.TABS.Keys(e.keyCode);

		if (!keys.isValidKey())
			return true;

		var curCell=$(".tabblock td.active_cell",this.htmlNode);
		var col=curCell.attr("data-col");
		var row=curCell.attr("data-row");
	
		if (keys.cursorMoveKey())
		{
			switch (e.keyCode)
			{
				case KEY_HOME:
					col=0;
					break;
					
				case KEY_END:
					col=tabBlockLength-1;
					break;

				case KEY_AVPAG:
					row=tabBlockNumStrings-1; //!!!!!!!!!!!
					break;

				case KEY_REPAG:
					row=0;
					break;

				case KEY_LEFT:
					col--;
					break;

				case KEY_RIGHT:
					col++;
					break;
					
				case KEY_UP:
					row--;
					break;

				case KEY_DOWN:
					row++;
					break;
			}
			if (col<0)
				col=0;
			if (col>tabBlockLength-1)
				col=tabBlockLength-1;
			
			if (row<0)
				row=0;
			if (row>tabBlockNumStrings-1) //!!!!!!!!!!!
				row=tabBlockNumStrings-1;
			
			this.updateCurrentCursor(col,row);
			return false;
		}
		else if (keys.keyCode==KEY_P || keys.keyCode==KEY_A || keys.keyCode==KEY_M || keys.keyCode==KEY_I)
		{
			this.insertColumnModifier(keys.getCharValue());
			return false;
		}
		else if (keys.keyCode==KEY_INSERT)
		{
			//console.log("INSERTING");
			this.insertSpace(e.shiftKey);
			return false;
		}
		else if (e.shiftKey && (e.keyCode==KEY_1 ||e.keyCode==KEY_2 ||e.keyCode==KEY_3 ||e.keyCode==KEY_4))
		{
			console.log("ZZZZ");
			this.setLFingerValue(keys.getCharValue(),col,row);
			return false;
		}		
		else if (keys.keyCode==KEY_BACKSPACE)
		{
			var curCell=$(".tabblock td.active_cell",this.htmlNode);
			var col=curCell.attr("data-col");
			var row=curCell.attr("data-row");
		
			if (col>0)
			{
				this.updateCurrentCursor(--col,row);
				this.removeSpace(e.shiftKey);
			}
			return false;
		}
		else if (keys.isColumnModifierKey())
		{
			var modifiersMatch={"g":"keyboard-accents","a":"keyboard-arrows"};
			this.insertColumnModifier(modifiersMatch[keys.getCharValue()]);
			return false;
		}
		else if (keys.keyCode==KEY_T)
		{
			this.showTextDialog();
			return false;
		}
		else
		{
			var cellVal=$(".tabblock td.active_cell",this.htmlNode).html();
			if (keys.keyCode==KEY_DELETE)
			{
				if (cellVal==EMPTY_NOTE_HTML)
				{
					this.removeSpace(e.shiftKey);
					return false;
				}
				input=EMPTY_NOTE;
			}
			else
				input=keys.getCharValue();
			
			if (isNumber(input) && parseInt(cellVal)<10 && parseInt(cellVal)!=0)
			{
				cellVal+=input;
				if (parseInt(cellVal)>19)
					cellVal=input;
			}
			else
				cellVal=input;
			
			//$(".tabblock td.active_cell",this.htmlNode).html(cellVal);
			this.setStringCellValue(col,row,cellVal,TYPE_NOTE/*,e.shiftKey*/);
			//if (cellVal==EMPTY_NOTE)
			//	this.setStringCellValue(col,row,cellVal,TYPE_LFINGER/*,e.shiftKey*/);
			
			if (keys.isNoteModifierKey())
			{
				var curCell=$(".tabblock td.active_cell",this.htmlNode);
				var col=(parseInt(curCell.attr("data-col"))+1)%tabBlockLength;
				
				var row=curCell.attr("data-row");
				this.updateCurrentCursor(col,row);		
			}
			
			this.updateText();
		}
		return true;
	},
	
	showTextDialog: function()
	{
		var prevSelectedSection=$(".tabsection.active");
		prevSelectedSection.removeClass("active");
		
		var col=$(".tabblock td.active_cell",this.htmlNode).attr("data-col");
		this.prevSelection=
		{
			"section":prevSelectedSection,
			"col":col
		};
		
		$("#note_text").val(this.data['colmodifiers']['text']['values'][col]);
		$this=this;
		
		this.tabBlockTextDialog=$("#tabblocktext_dialog").dialog({
			width: 300,
			open: function() {
				$("#tabblocktext_dialog").keypress(function(e) {
					if (e.keyCode == $.ui.keyCode.ENTER) 
						$this.closeTabBlockTextDialog($("#note_text").val());
				});
			},
			buttons: [
				{
					text: "Ok",
					click: function() {
						$this.closeTabBlockTextDialog($("#note_text").val());
					}
				},
				{
					text: "Clear",
					click: function() {
						$this.closeTabBlockTextDialog(null);
					}
				},
				{
					text: "Cancel",
					click: function() {
						$this.closeTabBlockTextDialog();
					}
				}
			]
		});
	},
	
	closeTabBlockTextDialog: function(val)
	{
		if (typeof val != "undefined")
		{
			this.setColModifierValue("text",this.prevSelection.col,val);
			this.updateText();
		}
		
		this.tabBlockTextDialog.dialog( "close" );
		this.prevSelection.section.addClass("active");		
	},
	
	updateText: function ()
	{
		this.updateASCIIText();

		if (typeof this.tabsEditorInstance!='undefined')
			this.tabsEditorInstance.updateText();
	},

	setColModifierValue: function (group,col,value)
	{
		var cell=$(".tabblock tr.extra."+group+" td[data-col='"+col+"']",this.htmlNode);
		
		if (group=="text")
		{
			cell.html(value);
		}
		else if (group=="rfingers")
		{
			//value="amip";
			cell.html(value.split('').join("<br>"));
		}
		else
		{
			if (this.data['colmodifiers'][group]['values'][col]==value)
				value=null;

			cell.attr("data-value",value);
			cell.removeClass().addClass("modifier_"+value);
		}
		
		if (value==null)
			this.data['colmodifiers'][group]['nummodifiers']--;
		else if (this.data['colmodifiers'][group]['values'][col]==null)		
			this.data['colmodifiers'][group]['nummodifiers']++;
			
		//console.log("#",this.data['colmodifiers'][group]['nummodifiers']);
			
		if (this.data['colmodifiers'][group]['nummodifiers']>0)
			$(".tabblock tr.extra."+group).show();
		else
			$(".tabblock tr.extra."+group).hide();

		this.data['colmodifiers'][group]['values'][col]=value;
		
		if (group=="rfingers")
			this.updateRFingerButtons(col);
	},
	
	getColModifierValue: function (group,col)
	{
		return $(".tabblock tr.extra."+group+" td[data-col='"+col+"']",this.htmlNode).attr("data-value");
	},
	
	getCellValue: function (col,row)
	{
		return $(".tabblock td[data-col='"+col+"'][data-row='"+row+"']",this.htmlNode).html();
	},

	getStringCellValue: function(col,string)
	{
		var type=TYPE_NOTE;
		//return this.data['strings'][string][col][type];
		return this.data['strings'][string][col].note;
	},
	
	setStringCellValue: function (col,string,value,type/*,shift*/)
	{
		col=parseInt(col);
		string=parseInt(string);

		if (!this.data['strings'][string][col])	
			this.data['strings'][string][col]={"note":EMPTY_NOTE,"rfinger":null};
		
		if (type==TYPE_NOTE)
		{
			$(".tabblock td[data-col='"+col+"'][data-row='"+string+"']",this.htmlNode).html(value);
			
			console.log(">>>>>>>>",value);

			if (value==EMPTY_NOTE)
			{
				console.log("LOL",string,col,value,this.data['strings'][string][col]);
				delete this.data['strings'][string][col];
			}
			else
				this.data['strings'][string][col].note=value;
		}
		else if (type==TYPE_LFINGER)
		{
			$(".tabblock td[data-col='"+col+"'][data-row='"+string+"']",this.htmlNode).removeClass (function (index, css) {
				return (css.match (/\blfinger\S+/g) || []).join(' ');
			});
			
			if (this.data['strings'][string][col][type]==value)
				value=EMPTY_NOTE;
			else
				$(".tabblock td[data-col='"+col+"'][data-row='"+string+"']",this.htmlNode).addClass("lfinger"+value);
			
			this.data['strings'][string][col].rfinger=value;
		}

		console.log(JSON.stringify(this.data.strings));
	},
	
	//@todo Change it to use the data instead of the html?
	updateASCIIText: function()
	{
		var textArray=new Array(tabBlockNumStrings);
		for (var i=0;i<tabBlockNumStrings;i++)
			textArray[i]=tabBlockNotes[i]+"|";

		var lastModifier=false;
		var lastHasAnyNote=false;
		
		for (var i=0;i<tabBlockLength;i++)
		{
			var modifier=false;
			var hasAnyNote=false; 
			var currentCol=new Array();
			var emptyCol=true;
			var longNote=false;
			
			for (var j=0;j<tabBlockNumStrings;j++)
			{
				var val=$(".tabblock td[data-col='"+i+"'][data-row='"+j+"']",this.htmlNode).html();
				if (val==EMPTY_NOTE)
					val="-";
				else
				{
					emptyCol=false;				
					isModifier=($.inArray(val, ['h','p','s','^','b','v','/','\\',])!==-1);
					modifier|=isModifier;
					if (!isModifier)
						hasAnyNote=true;
				}
				
				currentCol[j]={"note":val,"two_digits":val.length>1};
				longNote|=currentCol[j].two_digits;
			}
			
			//if (!modifier && !lastModifier && !emptyCol)
			if ((lastHasAnyNote && hasAnyNote) || (hasAnyNote && !modifier && !lastModifier))
			{
				// Incluir columna
				for (var x=0;x<tabBlockNumStrings;x++)
					textArray[x]+="-";
			}
			
			lastModifier=modifier;
			lastHasAnyNote=hasAnyNote;
			
			for (var x=0;x<tabBlockNumStrings;x++)
			{
				if (longNote && !currentCol[x].two_digits)
					textArray[x]+="-";
					
				textArray[x]+=currentCol[x].note;
			}
		}
		
		this.text="";
		for (var x=0;x<tabBlockNumStrings;x++)
			this.text+=textArray[x]+"\n";
	},

	getText: function()
	{
		return this.text;
	},
	
	updateCurrentCursor: function(col,row)
	{
		$(".tabblock td.active_column",this.htmlNode).removeClass("active_column");
		$(".tabblock td.active_cell",this.htmlNode).removeClass("active_cell");
		
		$(".tabblock td[data-col='"+col+"']",this.htmlNode).addClass("active_column");
		$(".tabblock td[data-col='"+col+"'][data-row='"+row+"']",this.htmlNode).addClass("active_cell");
		
		this.updateLFingerButtons(col,row);
		this.updateRFingerButtons(col);
	},
	
	updateLFingerButtons: function(col,row)
	{
		/*!!!!!!!!!
		var lfinger=this.data['strings'][row][col][TYPE_LFINGER];
				
		$("#lfingers a").removeClass("checked");
		
		if (lfinger!=EMPTY_NOTE)
			$("#lfingers a[data-modifier='lfinger"+lfinger+"']").addClass("checked");	
		*/
	},

	updateRFingerButtons: function(col)
	{
		var rfinger=this.data['colmodifiers']['rfingers']['values'][col];
		
		$("#rfingers a").removeClass("checked");
		
		if (rfinger!=null)
		{
			rfingers=rfinger.split("");
			for (var i=0;i<rfingers.length;i++)
				$("#rfingers a[data-modifier='"+rfingers[i]+"']").addClass("checked");	
		}
	},
	
	insertChord: function (chordId)
	{
		var chordDiagram=chords[chordId];
		var curCell=$(".tabblock td.active_cell",this.htmlNode);
		var col=curCell.attr("data-col");
		
		for (var i=0;i<tabBlockNumStrings;i++)
		{
			var fret=chordDiagram[((tabBlockNumStrings-1)-i)];
			if (fret=="X") 
				fret="";
			else
				fret=parseInt(fret,16);
			
			console.log(fret);
			this.setStringCellValue(col,i,fret.toString(),TYPE_NOTE); //???
		}

		this.updateText();
	},
	
	resortFingers: function(value)
	{
		var newVal="";
		if (value.indexOf("a")!=-1)
			newVal+="a";
		if (value.indexOf("m")!=-1)
			newVal+="m";
		if (value.indexOf("i")!=-1)
			newVal+="i";
		if (value.indexOf("p")!=-1)
			newVal+="p";
		return newVal;
	},
	
	accumColModifierValue: function (modifierGroup,col,modifier)
	{
		var currentVal=this.data['colmodifiers'][modifierGroup]['values'][col];
		
		if (currentVal==null)
			currentVal=modifier;
		else if (currentVal.indexOf(modifier)!=-1)
			currentVal=currentVal.replace(modifier,"");
		else
			currentVal+=modifier;
		
		if (modifierGroup=="rfingers")
			currentVal=this.resortFingers(currentVal);
		this.setColModifierValue(modifierGroup,col,currentVal);
	},
	
	toggleColumnModifier: function (modifierGroup,col,modifier)
	{
		var groupToggles={
			"accents":["golpe","accent",null],
			"arrows":["up_arrow","down_arrow","rasgueo",null]
		};
				
		var currentVal=this.data['colmodifiers'][modifierGroup]['values'][col];
		if (currentVal==null)
			index=0;
		else
			index=(groupToggles[modifierGroup].indexOf(currentVal)+1)%groupToggles[modifierGroup].length;
		
		modifier=groupToggles[modifierGroup][index];
		this.setColModifierValue(modifierGroup,col,modifier);		
	},
	
	insertColumnModifier: function (modifier)
	{
		var curCell=$(".tabblock td.active_cell",this.htmlNode);
		var col=curCell.attr("data-col");
		var value=curCell.attr("data-value");
	
		var modifierActions=
		{
			"keyboard-accents":	{"type":"toggle","group":"accents"},
			"keyboard-arrows":	{"type":"toggle","group":"arrows"},
			"golpe":			{"type":"set","group":"accents"},
			"accent":			{"type":"set","group":"accents"},
			"down_arrow":		{"type":"set","group":"arrows"},
			"up_arrow":			{"type":"set","group":"arrows"},
			"rasgueo":			{"type":"set","group":"arrows"},
			"text":				{"type":"set","group":"text"},
			"p":				{"type":"accum","group":"rfingers"},
			"i":				{"type":"accum","group":"rfingers"},
			"m":				{"type":"accum","group":"rfingers"},
			"a":				{"type":"accum","group":"rfingers"}			
		}
		
		console.log(modifier);
		switch (modifierActions[modifier].type)
		{
			case "toggle":
				this.toggleColumnModifier(modifierActions[modifier].group,col,modifier);
				break;
				
			case "accum":
				this.accumColModifierValue(modifierActions[modifier].group,col,modifier);
				break;
				
			case "set":
				this.setColModifierValue(modifierActions[modifier].group,col,modifier);
				break;
		}
		
		this.updateText();
	},

	insertModifier: function(modifier)
	{
		var curCell=$(".tabblock td.active_cell",this.htmlNode);
		var col=curCell.attr("data-col");
		var row=curCell.attr("data-row");
		
		if (curCell.html()!=EMPTY_NOTE_HTML)
			this.updateCurrentCursor(++col,row);

		this.setStringCellValue(col,row,modifier,TYPE_NOTE/*,e.shiftKey*/);

//		$(".tabblock td.active_cell",this.htmlNode).html(modifier);
		this.updateCurrentCursor(++col,row);
		this.updateText();
	},
	
	paint: function()
	{
		this.canvas.paint();
	}
}	

KORDS.TABS.TabsBlock.insertTabBlock=function()
{
    var tabBlockHtml='<table width="100%" class="tabblock">';

	// top
	for (var j=0;j<topColumnModifiers.length;j++)
	{
        tabBlockHtml+='<tr class="extra '+topColumnModifiers[j]+'" style="display:none">';
		for (var i=-1;i<tabBlockLength;i++)
		{
			tabBlockHtml+='<td data-col="'+i+'" data-value="">';
			tabBlockHtml+="</td>";
		}
		tabBlockHtml+="</tr>";
	}
	
    for (var j=0;j<tabBlockNotes.length;j++)
	{
        tabBlockHtml+='<tr class="string">';
		tabBlockHtml+="<td class=\"string-note\">"+tabBlockNotes[j]+"</td>";
		for (var i=0;i<tabBlockLength;i++)
		{
			tabBlockHtml+='<td data-col="'+i+'" data-row="'+j+'">';
			tabBlockHtml+="</td>";
		}
		tabBlockHtml+="</tr>";
	}
	
	// bottom
	for (var j=0;j<bottomColumnModifiers.length;j++)
	{
        tabBlockHtml+='<tr class="extra '+bottomColumnModifiers[j]+'" style="display:none">';
		for (var i=-1;i<tabBlockLength;i++)
		{
			tabBlockHtml+='<td data-col="'+i+'" data-value="">';
			tabBlockHtml+="</td>";
		}
		tabBlockHtml+="</tr>";
	}
	
	
	
    tabBlockHtml+="</table>";
		
	$("#tabblock").html(tabBlockHtml);
}

