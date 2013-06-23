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