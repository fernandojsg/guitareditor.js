KORDS.TABSDATA = KORDS.TABSDATA || {};

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