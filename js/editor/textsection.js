KORDS.TABSEDITOR.TextSection=function(htmlNode,prettyHtmlNode,tabsEditorInstance,data)
{
	this.tabsEditorInstance=tabsEditorInstance;
	this.htmlNode=htmlNode;
	this.type="text";
	
	this.div=prettyHtmlNode;
	this.div.setAttribute("class","pretty-text-block");

	if (typeof data != 'undefined')
		this.loadData(data);
	else
		this.sectionData=new KORDS.TABSDATA.TextSection;
}

KORDS.TABSEDITOR.TextSection.prototype = 
{
	loadData: function(data)
	{
		this.sectionData=data;
		this.htmlNode.find("textarea").val(data.text);
		console.log("loadinggg",data);
	},

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