KORDS.TABSDATA = KORDS.TABSDATA || {};

KORDS.TABSDATA.NoteCell=function()
{
	this.note=EMPTY_NOTE;
	//this.lfinger=null;
}

KORDS.TABSDATA.EmptySection=function()
{
	this.type=null;
}

KORDS.TABSDATA.YoutubeSection=function()
{
	this.youtubeId="";
	this.videoTitle="";
	this.type="youtube";
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
				"tuning": tabBlockNotes,
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
	this.data={
				"info": {"title":null, "artist":null, "transcriber":null}, 
				"sections":[]
			  };
}

KORDS.TABSDATA.Song.prototype =
{
	addSection: function(id,newSection)
	{
		this.data.sections.splice(id,0,newSection);
	},

	load: function (data)
	{
		this.data=JSON.parse(data);
	},

	save: function ()
	{
		return JSON.stringify(this.data, undefined, 2);
		//return JSON.stringify(this.sections);
	}
}