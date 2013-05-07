KORDS.TABSEDITOR.Keys=function(keyCode)
{
	if (typeof keyCode=='undefined')
		this.keyCode=-1;
	else
		this.keyCode=keyCode;
}

KORDS.TABSEDITOR.Keys.prototype = 
{
	getCharValue: function ()
	{
		keyCode=this.keyCode;
		if (this.keyCode>=KEY_NUMPAD_0 && this.keyCode<=KEY_NUMPAD_9)
			keyCode-=48;
		
		if (this.keyCode==KEY_BARRIGHT2)
			this.keyCode=KEY_BARRIGHT;
			
		return String.fromCharCode(keyCode).toLowerCase();
	},
	
	cursorMoveKey: function ()
	{
		return $.inArray(this.keyCode, 
			[
				KEY_LEFT,
				KEY_UP,
				KEY_RIGHT,
				KEY_DOWN,
				KEY_HOME,
				KEY_END,
				KEY_AVPAG,
				KEY_REPAG				
			])!==-1;
	},

	isColumnModifierKey: function (keyCode)
	{
		if (typeof keyCode=='undefined')
			keyCode=this.keyCode;
		
		return $.inArray(keyCode, 
			[
				KEY_A,
				KEY_G,
				KEY_LINE,
			])!==-1;
	},
			
	isNoteModifierKey: function (keyCode)
	{
		if (typeof keyCode=='undefined')
			keyCode=this.keyCode;
		
		return $.inArray(keyCode, 
			[
				KEY_H,
				KEY_P,
				KEY_S,
				KEY_B,
				KEY_V,
				KEY_BARRIGHT,
				KEY_BARRIGHT2,
				KEY_BARLEFT,
			])!==-1;
	},
		
	isValidKey: function()
	{
		return $.inArray(this.keyCode, 
			[
				KEY_BACKSPACE,
				KEY_INSERT,

				
				KEY_LEFT,
				KEY_UP,
				KEY_RIGHT,
				KEY_DOWN,

				KEY_A,
				KEY_G,
				KEY_P,
				KEY_M,
				KEY_I,
				
				KEY_0,
				KEY_1,
				KEY_2,
				KEY_3,
				KEY_4,
				KEY_5,
				KEY_6,
				KEY_7,
				KEY_8,
				KEY_9,

				KEY_NUMPAD_0,
				KEY_NUMPAD_1,
				KEY_NUMPAD_2,
				KEY_NUMPAD_3,
				KEY_NUMPAD_4,
				KEY_NUMPAD_5,
				KEY_NUMPAD_6,
				KEY_NUMPAD_7,
				KEY_NUMPAD_8,
				KEY_NUMPAD_9,

				KEY_BACKSPACE,
				/*KEY_TAB, */
				/*KEY_SPACE, */

				KEY_DELETE,
				KEY_BARRIGHT,
				KEY_BARRIGHT2,
				
				KEY_H,
				KEY_S,
				KEY_T,
				KEY_P,
				KEY_V,
				KEY_B,
				KEY_HOME,
				KEY_END,
				KEY_AVPAG,
				KEY_REPAG,

				KEY_LINE,
				
			])!==-1;
	}
}

var KEY_LINE=189;

var KEY_LEFT=37;
var KEY_UP=38;
var KEY_RIGHT=39;
var KEY_DOWN=40;
var KEY_HOME=36;
var KEY_END=35;
var KEY_AVPAG=34;
var KEY_REPAG=33;

var KEY_0=48;
var KEY_1=49;
var KEY_2=50;
var KEY_3=51;
var KEY_4=52;
var KEY_5=53;
var KEY_6=54;
var KEY_7=55;
var KEY_8=56;
var KEY_9=57;

var KEY_NUMPAD_0=96;
var KEY_NUMPAD_1=97;
var KEY_NUMPAD_2=98;
var KEY_NUMPAD_3=99;
var KEY_NUMPAD_4=100;
var KEY_NUMPAD_5=101;
var KEY_NUMPAD_6=102;
var KEY_NUMPAD_7=103;
var KEY_NUMPAD_8=104;
var KEY_NUMPAD_9=105;

var KEY_BACKSPACE=8;
var KEY_TAB=9;
var KEY_SPACE=32;

var KEY_DELETE=46;

var KEY_H=72;
var KEY_T=84;
var KEY_S=83;
var KEY_P=80;


var KEY_BARRIGHT2=111; 	
var KEY_BARRIGHT=47; 	

var KEY_BARLEFT=92; 	//!!!
var KEY_V=86;
var KEY_B=66;

var KEY_BACKSPACE=8;
var KEY_INSERT=45;

var KEY_A=65;
var KEY_P=80;
var KEY_M=77;
var KEY_I=73;

var KEY_G=71;