KORDS.TABSEDITOR.YoutubeSection=function(htmlNode,prettyHtmlNode,tabsEditorInstance,data)
{
	this.tabsEditorInstance=tabsEditorInstance;
	this.htmlNode=htmlNode;
	this.type="youtube";
	
	this.div=prettyHtmlNode;
	this.div.setAttribute("class","pretty-youtube-block");

	//@todo Bind here the events

	if (typeof data != 'undefined')
		this.loadData(data);
	else
		this.sectionData=new KORDS.TABSDATA.YoutubeSection;
}

KORDS.TABSEDITOR.YoutubeSection.prototype = 
{
	loadData: function(data)
	{
		this.sectionData=data;
		$(".youtube_url",this.htmlNode).val("http://www.youtube.com/watch?v="+this.sectionData.youtubeId);
		this.loadYoutubeLink();
	},

	loadYoutubeLink: function ()
	{
		var urlField=$(".youtube_url",this.htmlNode);
    	var youtubeId=youtubeParser(urlField.val());
    	
    	if (youtubeId==null)
	    {
	    	$(".youtube_id",this.htmlNode).val("");
	        if (!$(".youtube_id_error",this.htmlNode).length)
	        	urlField.parent().append('<span class="youtube_id_error" style="padding:5px">Invalid youtube URL</span>');
			$(".youtube_title",this.htmlNode).hide();

	    	this.sectionData.youtubeId="";
	    	this.sectionData.videoTitle="";
            tabsInstance.tabsEditor.updateText();
	    }
	    else
	    {
	    	$(".youtube_id",this.htmlNode).val(youtubeId);
	        $("youtube_id_error",this.htmlNode).remove();
	        $(".youtube_edit_data",this.htmlNode).hide();

	    	this.sectionData.youtubeId=youtubeId;
	        getYouTubeInfo(youtubeId,$(".youtube_title",this.htmlNode),this);
	    }
	},

	getData: function()
	{
		return this.sectionData;
	},
	
	getText: function()
	{
		return "YOUTUBE: "+this.sectionData.videoTitle+" (www.youtube.com/watch?v="+this.sectionData.youtubeId+")\n";
	},
	
	paint: function()
	{
		if (this.sectionData.youtubeId=="")
			video='<div></div>';
		else
			video='<div align="center" style="text-align:center"><iframe class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/'+this.sectionData.youtubeId+'" frameborder="0"></iframe></div>';
		this.div.innerHTML=video;
	},
	
	removeHtml: function()
	{
		this.div.parentNode.removeChild(this.div);
	},
}

function youtubeParser(url)
{
    var regExp=/.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[1].length==11)
        return match[1];
    else
        return null;

    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match&&match[7].length==11)
    {
        return match[7];
    }else{
        alert("Incorrect youtube URL");
    }
}

function getYouTubeInfo(youtubeId,youtubeTitleField,section) {
    $.ajax({
        url: "http://gdata.youtube.com/feeds/api/videos/"+youtubeId+"?v=2&alt=json",
        dataType: "jsonp",
        success: function (data) {
            //parseresults(data);
            var title = data.entry.title.$t;
            var description = data.entry.media$group.media$description.$t;
            var author = data.entry.author[0].name.$t;

            section.sectionData.videoTitle=title;            

            var video='<div align="center" style="text-align:center"><iframe class="youtube-player" type="text/html" width="640" height="385" src="http://www.youtube.com/embed/'+youtubeId+'" frameborder="0"></iframe></div>';
            youtubeTitleField.html(title+' <a href="#" class="youtube_edit button color mini">edit</a><br/>'+video).css("display","block");
            tabsInstance.tabsEditor.updateText();
        }
    });
}
