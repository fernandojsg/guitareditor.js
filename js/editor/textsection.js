KORDS.TABSEDITOR.TextSection=function(htmlNode,prettyHtmlNode,tabsEditorInstance)
{
	this.tabsEditorInstance=tabsEditorInstance;
	this.htmlNode=htmlNode;
	this.type="text";
	
	this.div=prettyHtmlNode;
	this.div.setAttribute("class","pretty-text-block");

	this.sectionData=new KORDS.TABSDATA.TextSection;
}

KORDS.TABSEDITOR.TextSection.prototype = 
{
	onKeyDown: function (keyCode)
	{
		if (typeof this.tabsEditorInstance.updateText!='undefined')
		{
			this.tabsEditorInstance.updateText();
			this.sectionData.text=this.htmlNode.find("textarea").val()+"\n";
		}
	},

	getData: function()
	{
		return this.sectionData.text;
	},
	
	getText: function()
	{
		//return this.htmlNode.find("textarea").val()+"\n";
		return this.sectionData.text;
	},
	
	paint: function()
	{
		this.div.innerHTML=this.getText().replace(/\n/g,"<br>");
	},
	
	removeHtml: function()
	{
		this.div.parentNode.removeChild(this.div);
	},
}