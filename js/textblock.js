KORDS.TABS.TextBlock=function(htmlNode,prettyHtmlNode,tabsEditorInstance)
{
	this.tabsEditorInstance=tabsEditorInstance;
	this.htmlNode=htmlNode;
	this.type="text";
	
	this.div=prettyHtmlNode;
	this.div.setAttribute("class","pretty-text-block");
}

KORDS.TABS.TextBlock.prototype = 
{
	onKeyDown: function (keyCode)
	{
		if (typeof this.tabsEditorInstance.updateText!='undefined')
			this.tabsEditorInstance.updateText();
	},
	
	getText: function()
	{
		return this.htmlNode.find("textarea").val()+"\n";
	},
	
	paint: function()
	{
		this.div.innerHTML=this.getText().replace(/\n/g,"<br>");
		//this.div.html(this.getText().replace(/\n/g,"<br>"));
	},
	
	removeHtml: function()
	{
		this.div.parentNode.removeChild(this.div);
	},
}