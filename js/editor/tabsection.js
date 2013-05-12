//var tabBlockLength=40;
var defaultNumMeasuresPerStave=4;
var defaultNumNotesPerMeasure=12;
var tabBlockLength=defaultNumNotesPerMeasure*defaultNumMeasuresPerStave+defaultNumMeasuresPerStave-1; // Num notes per stave + barlines$.parseXML('XML');
var tabBlockText="";
var tabBlockNotes=["E","B","G","D","A","E"];
var tabBlockNumStrings=tabBlockNotes.length;
var topColumnModifiers=["text","accents","arrows"];
var bottomColumnModifiers=["rfingers"];

var TYPE_NOTE=0;
var TYPE_LFINGER=1;
var TYPE_BOTH=2;

var EMPTY_NOTE="";
var EMPTY_NOTE_HTML="";

var chords={
	"Major":{
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
	},
	"Minor":{
		"Am": "002210",
		"Am#":"X13321",
		"Bm": "X24432",
		"Cm": "XX5543",
		"Cm#":"X46654",
		"Dm": "XX0231",
		"Dm#":"2X134X",
		"Em": "022000",
		"Fm": "XX3111",
		"Fm#":"244222",
		"Gm": "XX5333",
		"Gm#":"X21144"
	}
};

KORDS.TABSEDITOR.TabsSection=function(htmlNode,prettyHtmlNode,tabsEditorInstance,data)
{
	this.htmlNode=htmlNode;
	
	this.tabsEditorInstance=tabsEditorInstance;
	
	this.type="tabs";

	if (typeof data != 'undefined')
		this.loadData(data);
	else
		this.sectionData=new KORDS.TABSDATA.TabSection;

	this.updateText();

	this.div = prettyHtmlNode;
	this.canvas=new KORDS.TABSPAINTER.CanvasPainter(this.div,this.sectionData);
	
	this.updateText();
}

KORDS.TABSEDITOR.TabsSection.prototype = 
{
	loadData: function(data)
	{
		this.sectionData=data;
		for (var s=0;s<tabBlockNumStrings;s++)
		{
			var string=this.sectionData.data['strings'][s];
			for (var pos in string)
			{
				this.setStringNoteValue(pos,s,string[pos].note);
				if (string[pos].lfinger)
					this.setStringLFingerValue(pos,s,string[pos].lfinger);
			}
		}

		for (var modifierGroup in this.sectionData.data['colmodifiers'])
		{
			var group=this.sectionData.data['colmodifiers'][modifierGroup];
			for (var col in group)
				this.setColModifierValue(modifierGroup,col,group[col],true);
		}

		for (var col in this.sectionData.data['barlines'])
		{
			this.setBarLine(col,this.sectionData.data['barlines'][col]);
		}
	},
	
	removeHtml: function()
	{
		this.div.parentNode.removeChild(this.div);
	},

	getData: function()
	{
		return this.sectionData.data;
	},
	
	insertSpaceAtStringPos: function(col,row)
 	{
		for (var i=tabBlockLength-1;i>col;i--)
		{
			var value=this.getStringCellValue(i-1,row);
			if (this.getBarLine(i))
				this.setStringCellValue(i+1,row,value);
			else
				this.setStringCellValue(i,row,value);
		}
		delete this.sectionData.data['strings'][row][col];
	},

	removeSpaceAtCol: function(col)
	{
		for (var i=0;i<tabBlockNumStrings;i++)
			this.removeSpaceAt(col,i);

		// Column modifiers
		for (var groupId in this.sectionData.data.colmodifiers)
		{
			for (var i=col+1;i<tabBlockLength;i++)
			{
				var modVal=this.getColModifierValue(groupId,i);
				if (this.getBarLine(i))
					this.setColModifierValue(groupId,i-2,modVal,true);
				else
					this.setColModifierValue(groupId,i-1,modVal,true);
			}
			this.setColModifierValue(groupId,tabBlockLength-1,null,true);
		}
	},

	insertSpaceAtCol: function(col)
	{
		// Tabs
		for (var i=0;i<tabBlockNumStrings;i++)
		{
			this.insertSpaceAtStringPos(col,i);
			this.setStringCellValue(col,i,EMPTY_NOTE);
		}

		// Column modifiers
		for (var groupId in this.sectionData.data.colmodifiers)
		{
			for (var i=tabBlockLength-1;i>col;i--)
			{
				var modVal=this.getColModifierValue(groupId,i-1);
				if (this.getBarLine(i))
					this.setColModifierValue(groupId,i+1,modVal,true);
				else
					this.setColModifierValue(groupId,i,modVal,true);
			}
			this.setColModifierValue(groupId,col,null,true);
		}

		// Barlines
		//for (var i=tabBlockLength-1;i>col;i--)
		//	this.setBarLine(i,this.getBarLine(i-1));
	},
	
	insertSpace: function(wholeColumn)
	{
		var curCell=$(".tabblock td.active_cell",this.htmlNode);
		var col=parseInt(curCell.attr("data-col"));
		var row=parseInt(curCell.attr("data-row"));

		if (wholeColumn)
		{
			this.insertSpaceAtCol(col);
		}
		else
		{
			this.insertSpaceAtStringPos(col,row);
			this.setStringCellValue(col,row,EMPTY_NOTE);
		}
		this.updateText();
	},
	
	removeSpaceAt: function (col,row)
	{
		for (var i=col+1;i<tabBlockLength;i++)
		{
			var val=this.getStringCellValue(i,row);
			if (this.getBarLine(i-1))
				this.setStringCellValue(i-2,row,val);
			else
				this.setStringCellValue(i-1,row,val);
		}
		this.setStringCellValue(tabBlockLength-1,row,null);

		//this.setStringNoteValue(tabBlockLength-1,row,EMPTY_NOTE);
		//delete this.sectionData.data['strings'][row][col];
	},

	setLFingerValue: function(value,col,row)
	{
		if (typeof col=="undefined" || typeof row=="undefined")
		{
			var curCell=$(".tabblock td.active_cell",this.htmlNode);
			col=parseInt(curCell.attr("data-col"));
			row=parseInt(curCell.attr("data-row"));
		}
	
		if (cell=this.getStringCellValue(col,row) && cell.note!=EMPTY_NOTE)
		{
			this.setStringLFingerValue(col,row,value);
			this.updateText();
			this.updateCurrentCursor(col,row);	// ¿?¿?¿?¿?¿?
		}
	},

	removeSpace: function(wholeColumn)
	{
		var curCell=$(".tabblock td.active_cell",this.htmlNode);
		var col=parseInt(curCell.attr("data-col"));
		var row=parseInt(curCell.attr("data-row"));
		if (wholeColumn)
		{
			this.removeSpaceAtCol(col);
		}
		else
		{
			this.removeSpaceAt(col,row);
		}
		
		this.updateText();
	},

	onKeyDown: function (e)
	{
		var keys=new KORDS.TABSEDITOR.Keys(e.keyCode);
		console.log(e.keyCode);
		if (!keys.isValidKey())
			return true;

		var curCell=$(".tabblock td.active_cell",this.htmlNode);
		var col=parseInt(curCell.attr("data-col"));
		var row=parseInt(curCell.attr("data-row"));
	
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
			this.insertSpace(e.shiftKey);
			return false;
		}
		else if (e.shiftKey && (e.keyCode==KEY_1 ||e.keyCode==KEY_2 ||e.keyCode==KEY_3 ||e.keyCode==KEY_4))
		{
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
			var modifiersMatch={"g":"keyboard-accents","r":"keyboard-arrows","-":"barline_simple"};
			console.log(keys.getCharValue());
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
				if (this.getBarLine(col))
				{
					this.setBarLine(col,null);
					this.updateText();
					return false;
				}
				else if (cellVal==EMPTY_NOTE_HTML)
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
			this.setStringNoteValue(col,row,cellVal);
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
		
		$("#note_text").val(this.sectionData.data['colmodifiers']['text'][col]);
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

	emptyStringCol: function(col)
	{
		for (var i=0;i<tabBlockNumStrings;i++)
			this.setStringCellValue(col,i,null);
	},

	getBarLine: function(col)
	{
		var val=this.sectionData.data['barlines'][col];
		return (typeof val == 'undefined')?null:val;
	},

	setBarLine: function(col,value)
	{
		var cell=$(".tabblock tr.string td[data-col='"+col+"']",this.htmlNode);
		
		if (value==null)
		{
			delete this.sectionData.data['barlines'][col];
			//cell.remove('.barline_simple');
			cell.empty();
		}
		else
		{
			this.emptyStringCol(col);
			this.sectionData.data['barlines'][col]=value;
			cell.append('<div class="barline_simple"></div>');
			//cell.addClass("barline_simple");
		}
	},

	// @absolute Ignore the previous value of the cell (It doesn't toggle it)
	setColModifierValue: function (group,col,value,absolute)
	{
		var cell=$(".tabblock tr.extra."+group+" td[data-col='"+col+"']",this.htmlNode);
		
		if (group=="text")
		{
			if (typeof value=="undefined")
				cell.html("");
			else
				cell.html(value);					
		}
		else if (group=="rfingers")
		{
			//value="amip";
			if (value)
				cell.html(value.split('').join("<br>"));
			else
			{
				cell.empty();
				value=null;//@fixme
			}
		}
		else
		{
			if (typeof absolute == 'undefined' || !absolute)
				if (this.sectionData.data['colmodifiers'][group][col]==value)
 					value=null;
 			
			cell.attr("data-value",value);
			cell.removeClass().addClass("modifier_"+value);
		}
		
		if (value==null)
			delete this.sectionData.data['colmodifiers'][group][col];
		else
			this.sectionData.data['colmodifiers'][group][col]=value;

		if (objectSize(this.sectionData.data['colmodifiers'][group])>0)
			$(".tabblock tr.extra."+group).show();
		else
			$(".tabblock tr.extra."+group).hide();

		if (group=="rfingers")
			this.updateRFingerButtons(col);
	},
	
	getColModifierValue: function (group,col)
	{
		//return $(".tabblock tr.extra."+group+" td[data-col='"+col+"']",this.htmlNode).attr("data-value");
		return this.sectionData.data['colmodifiers'][group][col];
	},
	
	getStringCellValue: function (col,row)
	{
		return this.sectionData.data['strings'][row][col];
	},
/*
	getStringCellValue: function(col,string)
	{
		var type=TYPE_NOTE;
		//return this.sectionData.data['strings'][string][col][type];
		return this.sectionData.data['strings'][string][col].note;
	},
*/	
	
	setStringLFingerValue: function(col,string,value)
	{
		$(".tabblock td[data-col='"+col+"'][data-row='"+string+"']",this.htmlNode).removeClass (function (index, css) {
			return (css.match (/\blfinger\S+/g) || []).join(' ');
		});
		
		if (!this.sectionData.data['strings'][string][col])
			return;

		if (this.sectionData.data['strings'][string][col].lfinger==value)
			value=EMPTY_NOTE;
		else if (value!=EMPTY_NOTE)
			$(".tabblock td[data-col='"+col+"'][data-row='"+string+"']",this.htmlNode).addClass("lfinger"+value);
		
		this.sectionData.data['strings'][string][col].lfinger=value;
	},

	setStringNoteValue: function(col,string,value)
	{
		if (typeof value == 'undefined')
			value=EMPTY_NOTE;

		if (value==EMPTY_NOTE)
		{
			this.setStringLFingerValue(col,string,value); // Delete LFingers
			$(".tabblock td[data-col='"+col+"'][data-row='"+string+"']",this.htmlNode).html(value);
			delete this.sectionData.data['strings'][string][col];
		}
		else
		{
			if (!this.sectionData.data['strings'][string][col])	
				this.sectionData.data['strings'][string][col]=new KORDS.TABSDATA.NoteCell();

			if (this.sectionData.data['barlines'][col]!=null)
				this.setBarLine(col,null);

			$(".tabblock td[data-col='"+col+"'][data-row='"+string+"']",this.htmlNode).html(value);
			this.sectionData.data['strings'][string][col].note=value;
		}
	},

	setStringCellValue: function (col,string,value)
	{
		col=parseInt(col);
		string=parseInt(string);

		if (typeof value!='undefined' && value!=null)
		{
			this.setStringNoteValue(col,string,value.note);
			this.setStringLFingerValue(col,string,value.lfinger);
			//this.sectionData.data['strings'][string][col]=value;
		}
		else
		{
			this.setStringNoteValue(col,string,EMPTY_NOTE);
			this.setStringLFingerValue(col,string,EMPTY_NOTE);
		}
	},
	
	updateASCIIText: function()
	{
		//@todo Change it to use the data instead of the html?
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
				if (this.sectionData.data['barlines'][i]!=null)
					currentCol[j]={"note":"|","two_digits":false};
				else
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
	
		this.updateButtons(col,row);
	},

	updateButtons: function(col,row)
	{
		this.updateNoteButtons(col,row);
		this.updateColumnModifiersButtons(col);
		this.updateRFingerButtons(col);
	},

	updateColumnModifiersButtons: function(col)
	{
		$("#tabs-context-menu .colmodifier,#open-tabtext").removeClass("checked");

		for (colmod in this.sectionData.data['colmodifiers'])
		{
			var val=this.sectionData.data['colmodifiers'][colmod][col];
			if (val)
			{
				if (colmod=="text")
					val="text";
				$("#tabs-context-menu a[data-modifier='"+val+"']").addClass("checked");
			}
		}
		/*
		note=this.sectionData.data['strings'][row][col];
		
		$("#lfingers a[data-modifier^='lfinger']").removeClass("checked");
		
		if (typeof note == 'undefined' ||note==null)
			return;

		var lfinger=this.sectionData.data['strings'][row][col].lfinger;

		$("#lfingers a").removeClass("checked");
		if (lfinger!=EMPTY_NOTE)
			$("#lfingers a[data-modifier='lfinger"+lfinger+"']").addClass("checked");
		*/
	},

	updateNoteButtons: function(col,row)
	{
		//@fixme get value
		note=this.sectionData.data['strings'][row][col];
		
		$("#lfingers a[data-modifier^='lfinger']").removeClass("checked");
		
		if (typeof note == 'undefined' ||note==null)
			return;

		var lfinger=this.sectionData.data['strings'][row][col].lfinger;

		$("#lfingers a").removeClass("checked");
		if (lfinger!=EMPTY_NOTE)
			$("#lfingers a[data-modifier='lfinger"+lfinger+"']").addClass("checked");

		//@todo Update checked for note and col modifier
	},

	updateRFingerButtons: function(col)
	{
		var rfinger=this.sectionData.data['colmodifiers']['rfingers'][col];

		$("#rfingers a").removeClass("checked");
		
		if (rfinger!=null)
		{
			rfingers=rfinger.split("");
			for (var i=0;i<rfingers.length;i++)
				$("#rfingers a[data-modifier='"+rfingers[i]+"']").addClass("checked");	
		}
	},
	
	insertChord: function (chordId,mode)
	{
		var chordDiagram=chords[mode][chordId];
		var curCell=$(".tabblock td.active_cell",this.htmlNode);
		var col=curCell.attr("data-col");
		
		for (var i=0;i<tabBlockNumStrings;i++)
		{
			var fret=chordDiagram[((tabBlockNumStrings-1)-i)];
			if (fret=="X") 
				fret="";
			else
				fret=parseInt(fret,16);
			
			this.setStringNoteValue(col,i,fret.toString()); //???
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
		var currentVal=this.sectionData.data['colmodifiers'][modifierGroup][col];
		
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

	toggleBarLine: function(col)
	{
		var lineToggles=["|",null];

		var currentVal=this.getBarLine(col);
		if (currentVal==null)
			index=0;
		else
			index=(lineToggles.indexOf(currentVal)+1)%lineToggles.length;

		this.setBarLine(col,lineToggles[index]);
	},

	toggleColumnModifier: function (modifierGroup,col,modifier)
	{
		var groupToggles={
			"accents":["golpe","accent",null],
			"arrows":["up_arrow","down_arrow","rasgueo","alzapua","rasgueo3","rasgueo4",null]
		};
				
		var currentVal=this.sectionData.data['colmodifiers'][modifierGroup][col];
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

		if (modifier=="barline_simple")
		{
			this.toggleBarLine(col);
			this.updateText();
			return;
		}

		var modifierActions=
		{
			"keyboard-accents":	{"type":"toggle","group":"accents"},
			"keyboard-arrows":	{"type":"toggle","group":"arrows"},
			"golpe":			{"type":"set","group":"accents"},
			"accent":			{"type":"set","group":"accents"},
			"down_arrow":		{"type":"set","group":"arrows"},
			"up_arrow":			{"type":"set","group":"arrows"},
			"alzapua": 			{"type":"set","group":"arrows"},
			"rasgueo3": 		{"type":"set","group":"arrows"},
				"rasgueo4": 		{"type":"set","group":"arrows"},
			"rasgueo":			{"type":"set","group":"arrows"},
			"text":				{"type":"set","group":"text"},
			"p":				{"type":"accum","group":"rfingers"},
			"i":				{"type":"accum","group":"rfingers"},
			"m":				{"type":"accum","group":"rfingers"},
			"a":				{"type":"accum","group":"rfingers"},
		}
		
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

		this.setStringNoteValue(col,row,modifier);

//		$(".tabblock td.active_cell",this.htmlNode).html(modifier);
		this.updateCurrentCursor(++col,row);
		this.updateText();
	},
	
	paint: function()
	{
		this.canvas.paint();
	}
}	

KORDS.TABSEDITOR.TabsSection.insertTabBlock=function()
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