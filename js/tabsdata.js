KORDS.TABSDATA = KORDS.TABSDATA || {};

KORDS.TABSDATA.NoteCell=function()
{
	this.note=EMPTY_NOTE;
	this.lfinger=null;
}

KORDS.TABSDATA.EmptySection=function()
{
	this.type=null;
}

KORDS.TABSDATA.TextSection=function()
{
	this.type="text";
	this.text="";
}

KORDS.TABSDATA.TabSection=function()
{
	this.type="tabs";
	this.data={
				"numstrings":tabBlockNumStrings,
				"numcolumns":tabBlockLength,
				"strings":new Array(tabBlockNumStrings),
				"colmodifiers":{},
				"barlines":{},
			};

	for (var i=0;i<tabBlockNumStrings;i++)
		this.data['strings'][i]={};
		
	for (var i=0;i<topColumnModifiers.length;i++)
		this.data['colmodifiers'][topColumnModifiers[i]]={};
	
	for (var i=0;i<bottomColumnModifiers.length;i++)
		this.data['colmodifiers'][bottomColumnModifiers	[i]]={};
}

KORDS.TABSDATA.VideoSection=function()
{
	this.type="video";
}

KORDS.TABSDATA.AudioSection=function()
{
	this.type="audio";
}

KORDS.TABSDATA.Song=function()
{
	this.info={"title":null, "artist":null, "transcriber":null};
	this.sections=[];
}

KORDS.TABSDATA.Song.prototype = 
{
	addSection: function(id,newSection)
	{
		this.sections.splice(id,0,newSection);
	},

	load: function (data)
	{
		this.sections=JSON.parse(data);
	},

	save: function ()
	{
		return JSON.stringify(this.sections, undefined, 2);
		//return JSON.stringify(this.sections);
	}
}