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
				"strings":new Array(tabBlockNumStrings),
				"colmodifiers":{},
			};

	for (var i=0;i<tabBlockNumStrings;i++)
		this.data['strings'][i]={};
		
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
	this.numSections=0;
	//this.sections={};
	this.sections=[];
}


KORDS.TABSDATA.Song.prototype = 
{
	addSection: function(id,newSection)
	{
		this.numSections++;
		this.sections.splice(id,0,newSection);
	},

	load: function (data)
	{

	},

	save: function ()
	{

	}
}