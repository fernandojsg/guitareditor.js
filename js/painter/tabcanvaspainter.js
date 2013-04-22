KORDS.TABSPAINTER.CanvasPainter=function(parentDiv,tabBlock)
{
	this.debug=false;
			
	this.canvas = document.createElement('canvas');
	this.canvas.setAttribute('width', 600);
	this.canvas.setAttribute('height', 10);
	this.canvas.setAttribute('style', "background-color:#fff");
		
	parentDiv.appendChild(this.canvas);
	
	this.staveHeight=66;

	this.modifierHeight=16;
	this.modifierMargin=2;
	this.columnsModifiersMargin=6.5;

	this.numStrings=6;
	this.margin=10;
	this.noteMargin=20;
	
	this.tabBlock=tabBlock;

	if (this.canvas.getContext)
	{
		this.ctx = this.canvas.getContext('2d');
		this.resize();
	}
	else
		alert("Can't create Canvas Context!");
}

KORDS.TABSPAINTER.CanvasPainter.prototype = 
{
	resize: function()
	{
		this.numTopModifiers=0;
		this.nonEmptyTopModifiers=[];
		for (var i=0;i<topColumnModifiers.length;i++)		
		{
			if (objectSize(this.tabBlock.data['colmodifiers'][topColumnModifiers[i]])>0)
			{
				this.numTopModifiers++;
				this.nonEmptyTopModifiers.push(i);
			}
		}	
		
		this.numBottomLines=0;
		var maxNumFingers=0;
		for (var i=0;i<bottomColumnModifiers.length;i++)
		{
			if (objectSize(this.tabBlock.data['colmodifiers'][bottomColumnModifiers[i]])>0)
			{
				for (var j in this.tabBlock.data['colmodifiers']['rfingers'])
				{
					var fingers=this.tabBlock.data['colmodifiers']['rfingers'][j];
					if (fingers && fingers.length>maxNumFingers)
						maxNumFingers=fingers.length;
				}
			}
		}
		this.numBottomLines=maxNumFingers;
		
		var topModifiersHeight=(this.modifierHeight+this.modifierMargin)*this.numTopModifiers+this.columnsModifiersMargin;
		//var bottomModifiersHeight=(this.modifierHeight+this.modifierMargin)*this.numBottomLines+this.columnsModifiersMargin;
		var bottomModifiersHeight=10*this.numBottomLines+this.columnsModifiersMargin;
		
		this.canvas.height=this.staveHeight+topModifiersHeight+bottomModifiersHeight;
		
		this.canvasW=this.canvas.width;
		this.canvasH=this.canvas.height;
		//this.staveOffsetY=(this.canvasH-this.staveHeight)/2+(this.staveHeight/this.numStrings/2)+this.columnsModifiersMargin;
		//this.staveOffsetY=(this.canvasH-this.staveHeight)/2+(this.staveHeight/this.numStrings/2)+this.columnsModifiersMargin;
		
		this.stepX=(this.canvasW-this.noteMargin*2)/tabBlockLength;
		this.stepY=this.canvasH/6;
		
		this.linesOffset=this.staveHeight/this.numStrings;
	
		this.staveOffsetY=topModifiersHeight+this.linesOffset/2+0.5;

		//this.canvas.height=this.staveHeight+(this.modifierHeight+this.modifierMargin)*numTopModifiers*2+this.columnsModifiersMargin*2;
	},
	
	drawNoteModifier: function(modifier,cx0,cx1,cy,val0,val1)
	{
		cx0+=this.ctx.measureText(val0).width/2;
		cx1-=this.ctx.measureText(val0).width/2;
		
		if (["s","/","\\"].indexOf(modifier)!=-1)
		{
			cy-=this.linesOffset/2;
			this.ctx.strokeWidth=1;
			this.ctx.strokeStyle="#666";
			this.ctx.beginPath();
			direction=(parseInt(val0)>parseInt(val1))?-1:1;
			this.ctx.moveTo(cx0, cy + (3 * direction));
			this.ctx.lineTo(cx1, cy - (3 * direction));
			this.ctx.closePath();
			this.ctx.stroke();		
		}
		else if (["^","h","p"].indexOf(modifier)!=-1)
		{
			top_cp_y=cy-this.linesOffset*1.2;
			bottom_cp_y=cy-this.linesOffset;
//			cx0+=this.ctx.measureText(val0).width;
			cp_x=cx0+(cx1-cx0)/2;
			cy-=this.linesOffset/2;
			
			this.ctx.beginPath();
				this.ctx.moveTo(cx0, cy);
				this.ctx.quadraticCurveTo(cp_x, top_cp_y,	cx1, cy);
				this.ctx.quadraticCurveTo(cp_x, bottom_cp_y,cx0, cy);
			this.ctx.closePath();
			this.ctx.fill();
		}
		else if (modifier=="v")
		{
			var vibrato_width=12;
			var wave_height=6;
			var wave_width=2;
			var wave_girth=2;
			var num_waves = vibrato_width / wave_width;

			var w=this.ctx.measureText("v").width;
			
			this.ctx.beginPath();
			var x=cx0-w;
			var y=cy-this.linesOffset/2;
			
			this.harsh=false;
			
			if (this.harsh)
			{
				x+=w*2;
				this.ctx.moveTo(x, y + wave_girth);
				for (var i = 0; i < num_waves / 2; ++i) 
				{
					this.ctx.quadraticCurveTo(x + (wave_width / 2), y - (wave_height / 2),
						x + wave_width, y);
					x += wave_width;
					this.ctx.quadraticCurveTo(x + (wave_width / 2), y + (wave_height / 2),
						x + wave_width, y);
					x += wave_width;

					for (var i = 0; i < num_waves / 2; ++i) {
						this.ctx.quadraticCurveTo(
							x - (wave_width / 2),
							(y + (wave_height / 2)) + wave_girth,
							x - wave_width, y + wave_girth);
						x -= wave_width;
						this.ctx.quadraticCurveTo(
							x - (wave_width / 2),
							(y - (wave_height / 2)) + wave_girth,
							x - wave_width, y + wave_girth);
						x -= wave_width;
					}
					this.ctx.fill();
				}
			} else {
				this.ctx.moveTo(x, y + wave_girth + 1);
				  for (var i = 0; i < num_waves / 2; ++i) {
					this.ctx.lineTo(x + wave_width, y - (wave_height / 2));
					x += wave_width;
					this.ctx.lineTo(x + wave_width, y + (wave_height / 2));
					x += wave_width;
				  }
				  for (var i = 0; i < num_waves / 2; ++i) {
					this.ctx.lineTo(x - wave_width, (y - (wave_height / 2)) + wave_girth + 1);
					x -= wave_width;
					this.ctx.lineTo(x - wave_width, (y + (wave_height / 2)) + wave_girth + 1);
					x -= wave_width;
				  }
				  this.ctx.fill();
			}
		}	
	},
	
	drawColumnModifier: function(group,modifier,cx0,cx1,cy,val0,val1)
	{
		var w=this.stepX;
		
		if (group=="rfingers")
		{
			cy=this.staveOffsetY+this.staveHeight+this.columnsModifiersMargin;
			//line*(this.modifierHeight+this.modifierMargin)-this.modifierHeight/2;
		}
		else
		{
			var line=this.nonEmptyTopModifiers.indexOf(topColumnModifiers.indexOf(group));
			//var line=topColumnModifiers.indexOf(group);
			//cy=line*(this.modifierHeight+this.modifierMargin)-this.modifierHeight/2;
			cy=line*(this.modifierHeight+this.modifierMargin)+this.modifierHeight/2;
		}

		if (this.debug)
		{
			this.ctx.fillStyle="#f00";
			this.ctx.beginPath();
			this.ctx.arc(cx0, cy, 2, 0, 2 * Math.PI, true);
			this.ctx.stroke();
		}


		if (group=="rfingers")
		{
//			var cx=i*this.stepX+this.margin;
//			var cy=j*this.linesOffset+this.staveOffsetY+this.linesOffset/2;
			
			this.ctx.font = "10px sans-serif";
//			w=this.ctx.measureText(note).width;
//			this.ctx.clearRect(cx-w/2,cy-this.linesOffset,w,this.linesOffset);
			this.ctx.textAlign = 'center';
			var lineheight = 11;
			var lines = val0.split('');
			x=cx0;
			y=cy;
			for (var i = 0; i<lines.length; i++)
				this.ctx.fillText(lines[i], x, y + (i*lineheight) );
		}
		else if (group=="text")
		{
			this.ctx.fillStyle="#000";
			//w=this.ctx.measureText(modifier).width;
			///this.ctx.clearRect(cx-w/2,cy-this.linesOffset,w,this.linesOffset);
			this.ctx.font = "10px sans-serif";
			this.ctx.textAlign = 'left';
			this.ctx.fillText(modifier, cx0-w/4, cy+4);
		}
		else if (modifier=="golpe")
		{
			w=w/4;
			//cy-=17;
			this.ctx.beginPath();
				this.ctx.moveTo(cx0-w,cy-w);
				this.ctx.lineTo(cx0+w,cy-w);
				this.ctx.lineTo(cx0+w,cy+w);
				this.ctx.lineTo(cx0-w,cy+w);
				this.ctx.lineTo(cx0-w,cy-w);
			//this.ctx.closePath();
			this.ctx.stroke();
		}
		else if (modifier=="accent")
		{
			w=w/4+0.8;
			this.ctx.beginPath();
				this.ctx.moveTo(cx0-w,cy-w);
				this.ctx.lineTo(cx0+w,cy);
				this.ctx.lineTo(cx0-w,cy+w);
			this.ctx.stroke();
		}
		else if (modifier=="up_arrow")
		{
			var h=this.modifierHeight/2;
			
			this.ctx.beginPath();
				this.ctx.moveTo(cx0,cy-h);
				this.ctx.lineTo(cx0,cy+h);
			this.ctx.stroke();
			w=w/4;
			
			this.ctx.beginPath();
				this.ctx.moveTo(cx0-w,cy-h/2);
				this.ctx.lineTo(cx0+w,cy-h/2);
				this.ctx.lineTo(cx0, cy-h);
				this.ctx.lineTo(cx0-w,cy-h/2);
			this.ctx.fill();
		}
		else if (modifier=="down_arrow")
		{
			var h=this.modifierHeight/2;
			
			this.ctx.beginPath();
				this.ctx.moveTo(cx0,cy-h);
				this.ctx.lineTo(cx0,cy+h);
			this.ctx.stroke();
			w=w/4;
			this.ctx.beginPath();
				this.ctx.moveTo(cx0-w,cy+h/2);
				this.ctx.lineTo(cx0+w,cy+h/2);
				this.ctx.lineTo(cx0, cy+h);
				this.ctx.lineTo(cx0-w,cy+h/2);
			this.ctx.fill();
		}
		else if (modifier=="rasgueo")
		{
			var h=this.modifierHeight/2;
			
			this.ctx.beginPath();
			var numTwists=3;
			w=w/4;
			
			this.ctx.moveTo(cx0,cy-h/2);
			
			cyTwist=cy-h/2;
			wTwist=w/2;
			for (var i=0;i<numTwists*2;i++)
			{
				hInc=(i+1)*h/numTwists-h/2;
				this.ctx.lineTo(cx0-wTwist,cyTwist+hInc);
				wTwist*=-1;
			}
			this.ctx.stroke();
			
			this.ctx.beginPath();
				this.ctx.moveTo(cx0-w,cy-h/2);
				this.ctx.lineTo(cx0+w,cy-h/2);
				this.ctx.lineTo(cx0, cy-h);
				this.ctx.lineTo(cx0-w,cy-h/2);
			this.ctx.fill();
			
		}
		
	},
	
	drawModifier: function(modifier,fromPos,toPos,string)
	{
		var cx0=fromPos*this.stepX+this.noteMargin;
		var cx1=toPos*this.stepX+this.noteMargin;

		if (isNumber(string))
		{
			var val0=this.tabArray[string][fromPos]?this.tabArray[string][fromPos].note:0;
			var val1=this.tabArray[string][toPos]?this.tabArray[string][toPos].note:0;
			
			var cy=string*this.linesOffset+this.staveOffsetY+this.linesOffset/2;
			this.drawNoteModifier(modifier,cx0,cx1,cy,val0,val1);
		}
		else
		{
			var val0=this.modifiers[string][fromPos];
			var val1=val0;
			var line=20;
			var cy=line*this.linesOffset+this.staveOffsetY+this.linesOffset/2;			
			this.drawColumnModifier(string,modifier,cx0,cx1,cy,val0,val1);
		}
	},

	paintStave: function()
	{
		this.ctx.strokeStyle = '#333';
		this.ctx.lineWidth=1;
		/* this.ctx.font = "12px sans-serif"; */
		this.ctx.font = "12px sans-serif";
		this.ctx.fillStyle="#ff9";
		this.ctx.clearRect(0,0,this.canvasW,this.canvasH);
//		this.ctx.fillRect(0,0,this.canvasW,this.canvasH);
		this.ctx.fillStyle="#000";
		
		// debug
		if (this.debug)
		{
			this.ctx.strokeStyle="#f00";
			this.ctx.beginPath();
			for (var y = 0; y < this.numTopModifiers; y++)
			{
				var height0=(this.modifierHeight+this.modifierMargin)*(y);
				this.ctx.moveTo(this.margin, 				height0);
				this.ctx.lineTo(this.canvasW-this.margin, 	height0);
			}
			this.ctx.closePath();
			this.ctx.stroke();
			this.ctx.strokeStyle="#00f";
			this.ctx.beginPath();
			for (var y = 0; y < this.numTopModifiers; y++)
			{
				var height0=(this.modifierHeight+this.modifierMargin)*(y)+(this.modifierHeight+this.modifierMargin)/2;
				this.ctx.moveTo(this.margin, 				height0);
				this.ctx.lineTo(this.canvasW-this.margin, 	height0);
			}
			this.ctx.closePath();
			this.ctx.stroke();
		}		
		
		this.ctx.strokeStyle="#000";
		
		this.ctx.beginPath();
		for (var y = 0; y < this.numStrings; y++)
		{
			this.ctx.moveTo(this.margin, 				y*this.linesOffset+this.staveOffsetY);
			this.ctx.lineTo(this.canvasW-this.margin, 	y*this.linesOffset+this.staveOffsetY);
		}
		this.ctx.moveTo(this.margin, this.staveOffsetY);
		this.ctx.lineTo(this.margin, 5*this.linesOffset+this.staveOffsetY);
		this.ctx.moveTo(this.canvasW-this.margin, this.staveOffsetY);
		this.ctx.lineTo(this.canvasW-this.margin, 5*this.linesOffset+this.staveOffsetY);
		this.ctx.closePath();
		
		this.ctx.stroke();
		
	},
	
	paintNotes: function()
	{
		var binaryNoteModifiers=['^','h','s','p','b'];
		for (var j=0;j<this.numStrings;j++)
		{
			var prevNotePos=0;
			var onBinaryModifier=false;
			var prevBinaryModifier="";

			for (var i in this.tabArray[j])
			{
				cell=this.tabArray[j][i];
				var note=cell.note;

				if (binaryNoteModifiers.indexOf(note)!=-1)
				{
					onBinaryModifier=true;
					prevBinaryModifier=note;
				}
				else if (note=="v")
					this.drawModifier("v",i,i,j);
				else
				{
					if (onBinaryModifier)
					{
						this.drawModifier(prevBinaryModifier,prevNotePos,i,j);
					}
					var cx=i*this.stepX+this.noteMargin;
					var cy=j*this.linesOffset+this.staveOffsetY+this.linesOffset/2;
					
					this.ctx.font = "12px sans-serif";
					var w=this.ctx.measureText(note).width;
					this.ctx.clearRect(cx-w/2,cy-this.linesOffset,w,this.linesOffset);
					this.ctx.textAlign = 'center';
					this.ctx.fillText(note, cx, cy);
					
					var number=parseInt(this.tabArray[j][i].lfinger);
					if (isNumber(number))
					{
						this.ctx.font = "8px sans-serif";
						this.ctx.fillText(number, cx+w, cy-w/1.1);
					}
					prevNotePos=i;
					onBinaryModifier=false;
				}
			}
		}
	},
	
	paint: function ()
	{
		this.resize();//!!!!!!!!!
		
		var data=this.tabBlock.data;

		this.tabArray=data.strings;
		this.modifiers=data.colmodifiers;
		this.barLines=data.barlines;

		this.ctx.save();
		this.paintStave();
		this.paintNotes();
		this.paintColumnModifiers();
		this.paintBarLines();
		this.ctx.restore();
	},	

	
	drawBarLine:function (column,type)	
	{
		if (type=="|")
		{
			// |
			var cx0=column*this.stepX+this.noteMargin;
			this.ctx.strokeStyle="#000";
			this.ctx.beginPath();
			this.ctx.moveTo(cx0, this.staveOffsetY);
			this.ctx.lineTo(cx0, 5*this.linesOffset+this.staveOffsetY);
			this.ctx.closePath();
			this.ctx.stroke();
		}
		else if (type=="||")
		{
  			// ||
			var cx0=column*this.stepX+this.stepX/5+this.noteMargin;
			var cx1=column*this.stepX-this.stepX/5+this.noteMargin;
			this.ctx.strokeStyle="#000";
			this.ctx.beginPath();
			this.ctx.moveTo(cx0, this.staveOffsetY);
			this.ctx.lineTo(cx0, 5*this.linesOffset+this.staveOffsetY);
			this.ctx.moveTo(cx1, this.staveOffsetY);
			this.ctx.lineTo(cx1, 5*this.linesOffset+this.staveOffsetY);
			this.ctx.closePath();
			this.ctx.stroke();
		}
	},

	paintBarLines: function ()
	{
		for (var i in this.barLines)
			this.drawBarLine(i,this.barLines[i]);
	},

	paintColumnModifiers: function ()
	{
		this.linesOffset=this.staveHeight/this.numStrings;
		this.ctx.strokeStyle="#000";
		
		var stepX=this.canvasW/tabBlockLength;
		var stepY=this.canvasH/(this.numStrings+1);
		
		for (var group in this.modifiers)
		{
			for (var i in this.modifiers[group])
			{
				var modifier=this.modifiers[group][i];
				this.drawModifier(modifier,i,i,group);
			}
		}
	}
}
