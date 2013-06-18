function isEmptyCol(lines,i)
{
	for (var j=0;j<lines.length;j++)
		if (lines[j][i]!='-')
			return false;
	
	return true;
}

function cleanLine(line)
{
	line=line.replace(/\|/g,'');
	line=line.substring(line.indexOf("-"));
	return line.trim();
}
   
KORDS.TABSEDITOR.TabParser=function(text)
{
	this.text=text;
	this.sections=[];
}

KORDS.TABSEDITOR.TabParser.prototype = 
{
	
	cleanLine: function (line)
	{
		line=line.replace(/\|/g,'');
		line=line.substring(line.indexOf("-"));
		return line;
	},
	
	addNewSection: function(type,start,end)
	{
		if (type=="tab")
		{
			console.log("NEW TAB",start,end);
			var tab=new Array();
			for (var k=start;k<=end;k++)
			{
				var line=this.cleanLine(this.lines[k]);
				for (var i=10;i<25;i++)
					line=line.replace(new RegExp(i,"g"),String.fromCharCode(55+i)+"-");

				tab.push(line);
			}
			
			var maxDistance=99;
			var currDistance=0;
			
			var numCols=tab[0].length;
			var distances=[];
			
			for (var k=0;k<numCols;k++)
			{
				if (isEmptyCol(tab,k))
					currDistance++;			
				else
				{
					if (currDistance!=0)
					{
						console.log(currDistance,k);
						distances.push({"distance":currDistance,"col":k-currDistance});
						if (currDistance<maxDistance)
							maxDistance=currDistance;
						currDistance=0;
					}
				}
			}
			
			// Remove empty last columns
			for (var k=0;k<tab.length;k++)
				tab[k]=tab[k].substring(0,numCols-currDistance+1);
			
			// Remove the repeated
			for (var d=0;d<distances.length;d++)
			{
				//console.log(distances[d]);
				k=0;
				var pos=distances[d].col;
				while (distances[d].distance>maxDistance)
				{
					for (var i=0;i<tab.length;i++)
					{
						for (var j=0;j<maxDistance;j++)
							tab[i]=tab[i].replaceAt(pos+j,"*");
					}
					distances[d].distance-=maxDistance;
					pos+=maxDistance;
				}
			}

			for (var i=0;i<tab.length;i++)
				tab[i]=tab[i].replace(/\*/g,'');

			// Collapse 2-3 => 23
			numCols=tab[0].length;
			var blocks=[];
			currDistance=0;
			for (var k=0;k<numCols;k++)
			{
				if (isEmptyCol(tab,k))
					currDistance++;			
				else
				{
					if (currDistance!=0)
					{
						console.log(currDistance,k);
						blocks.push(k-currDistance);
						currDistance=0;
					}
				}
			}
			
			for (var k=0;k<blocks.length;k++)
			{
				for (var i=0;i<tab.length;i++)
					tab[i]=tab[i].replaceAt(blocks[k],"*");
			}			
			for (var i=0;i<tab.length;i++)
				tab[i]=tab[i].replace(/\*/g,'');
				
			for (var i=0;i<tab.length;i++)
				console.log(tab[i]);


				
			this.sections.push({"type":"tabs","val":tab});
		}
		else
		{
			console.log("NEW TEXT",start,end);
			var text="";
			for (var k=start;k<=end;k++)
			{
				if (text!="")
					text+="\n";
					
				text+=this.lines[k];
			}
			
			//console.log(this.sections);
			this.sections.push({"type":"text","val":text});
		}
	},
	
	parse: function()
	{
		this.lines=this.text.split("\n");
		var i=0;
		var inTab=false;
		var lastInTabIndex=0;
		var currentTabLines=0;
		var lastInTextSection=-1;
		var sections=[];
		
		while (i<this.lines.length)
		{
			var line=this.lines[i];
			
			if (line.indexOf('-')!=-1)
			{
				if (!inTab)
				{
					lastInTabIndex=i;
					inTab=true;
				}
				currentTabLines++;
		
				line=this.cleanLine(line);

				if (currentTabLines>5)
				{
					if (lastInTextSection!=-1)
						this.addNewSection("text",lastInTextSection,lastInTabIndex-1);
					this.addNewSection("tab",lastInTabIndex,i);
					lastInTextSection=-1;
					inTab=false;
					currentTabLines=0;
				}
			}
			else
			{
				if (lastInTextSection==-1)
					lastInTextSection=i;
				inTab=false;
				currentTabLines=0;
			}
			i++;
		}		
//		console.log(this.sections);
		return this.sections;
	}
}	
