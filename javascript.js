/* This is a basic UI library for JavaScript on HTML5 Canvas 
   Inheritance is implemented manually by implementing all functions and variables in parents
   Its messy but is works most of the time. Thats JavaScript. 
	
	If all you have is mud you can only build mudhuts or maybe brick buildings. 
	
*/
var CharSets = {	// Corresponds Keystrokes to Chars
	nums: [], chars: [],
	setup: function()
	{	this.nums[48] = "0";		this.nums[96] = "0";	
		this.nums[49] = "1";		this.nums[97] = "1";	
		this.nums[50] = "2";		this.nums[98] = "2";	
		this.nums[51] = "3";		this.nums[99] = "3";	
		this.nums[52] = "4";		this.nums[100] = "4";	
		this.nums[53] = "5";		this.nums[101] = "5";	this.nums[110] = ".";
		this.nums[54] = "6";		this.nums[102] = "6";	this.nums[190] = ".";
		this.nums[55] = "7";		this.nums[103] = "7";	
		this.nums[56] = "8";		this.nums[104] = "8";
		this.nums[57] = "9";		this.nums[105] = "9";
		
		this.chars[48] = "0";	this.chars[96] = "0";	this.chars[65] = "a";	this.chars[75] = "k";	this.chars[85] = "u";
		this.chars[49] = "1";	this.chars[97] = "1";	this.chars[66] = "b";	this.chars[76] = "l";	this.chars[86] = "v";
		this.chars[50] = "2";	this.chars[98] = "2";	this.chars[67] = "c";	this.chars[77] = "m";	this.chars[87] = "w";
		this.chars[51] = "3";	this.chars[99] = "3";	this.chars[68] = "d";	this.chars[78] = "n";	this.chars[88] = "x";
		this.chars[52] = "4";	this.chars[100] = "4";	this.chars[69] = "e";	this.chars[79] = "o";	this.chars[89] = "y";
		this.chars[53] = "5";	this.chars[101] = "5";	this.chars[70] = "f";	this.chars[80] = "p";	this.chars[90] = "z";
		this.chars[54] = "6";	this.chars[102] = "6";	this.chars[71] = "g";	this.chars[81] = "q";	this.chars[190] = ".";
		this.chars[55] = "7";	this.chars[103] = "7";	this.chars[72] = "h";	this.chars[82] = "r";	this.chars[110] = ".";
		this.chars[56] = "8";	this.chars[104] = "8";	this.chars[73] = "i";	this.chars[83] = "s";
		this.chars[57] = "9";	this.chars[105] = "9";	this.chars[74] = "j";	this.chars[84] = "t";
	},	
};	CharSets.setup();
var CanvasContainer = {
	keyFocus: null, visible: true,
	x:0, y: 0, dx:0, dy:0,width:300,height:300, mouseX: 0, mouseY: 0,
	kids: [], parent: null, active: true, context: null, canvas: null,
	backgroundColor: 			"grey", 		color: "white", 
	mouseOverBackgroundColor: 	"lightgrey",
	mouseDownBackfroundColor: 	"white",
	mouseState: 				"MouseOut",
	
	setup: 		function(){
		this.canvas  = document.getElementById("canvas");
		var sizeDetails = this.canvas.getBoundingClientRect();
		this.width = sizeDetails.width; this.height = sizeDetails.height;
		this.context = this.canvas.getContext("2d");
			
		//Setup events for canvas
		function getMousePos(canvas, evt) { //Gets x.y of Mouse on Canvas
			var rect = this.canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			}	;
		};
		var from = this;
		canvas.addEventListener('mousedown', function(evt) {
			var mousePos = getMousePos(this.canvas, evt);
			CanvasContainer.mouseDown(from, mousePos.x,mousePos.y);
		}, false);
		canvas.addEventListener('mouseover', function(evt) {
			var mousePos = getMousePos(this.canvas, evt);
			CanvasContainer.mouseOver(from, mousePos.x,mousePos.y);
		}, false);
		canvas.addEventListener('mouseout', function(evt) {
			var mousePos = getMousePos(this.canvas, evt);
			CanvasContainer.mouseOut(from, mousePos.x,mousePos.y);
		}, false);
		canvas.addEventListener('mousemove', function(evt) {
			var mousePos = getMousePos(this.canvas, evt);
			CanvasContainer.mouseOver(from, mousePos.x,mousePos.y);
		}, false);
		//End Setup Events for Canvas
		
		this.paint(this); //First call to paint();
	},
	inside: 	function(from,x,y) 	{return true;},
	paint:		function(from) 		{ var i;	
		// Background
			from.context.beginPath();
			from.context.rect(from.x,from.y, from.width, from.height);
			if(from.mouseState == "MouseOver") 
				from.context.fillStyle = from.mouseOverBackgroundColor;
			else if (from.mouseState == "MouseOut")
				from.context.fillStyle = from.backgroundColor;
			else if (from.mouseState == "MouseClicked")
				from.context.fillStyle = from.mouseDownBackfroundColor;
			from.context.fill();
		//End of Background Painting
		//Paint Kids
			if(from.kids != null && from.kids != [])
			{	for(i = 0; i < from.kids.length; i++)
				{	if(from.kids[i].visible)  
						from.kids[i].paint(from.kids[i]);
				}
			}
		//End of Paint Kids
	},	
	reposition: function(from,dx,dy){},	// repositions itself and any containers underneath
	mouseDown: 	function(from,x,y) 	{
		var inAny = false;
		//Kids
			if(from.kids != null)
			{	for(i in from.kids)
				{	if(from.kids[i].visible && from.kids[i].inside(from.kids[i],x,y))
					{	from.kids[i].mouseDown(from.kids[i],x,y);
						inAny = true;
					}
				}
			}
		//EndKids
		if(!inAny)
		{	from.mouseState = "MouseClicked";	from.paint(from);
			CanvasContainer.keyFocus = null;
		}
		window.setTimeout(function(){from.mouseState = "MouseOver";	from.paint(from);},100);
	}, // action
	mouseOver: 	function(from,x,y) 	{
		from.mouseState = "MouseOver";  
		//Kids
		
			if(from.kids != null && from.kids != [])
			{	for(i = 0; i < from.kids.length; i++)
				{	if(from.kids[i].visible)
					{	from.kids[i].mouseOver(from.kids[i],x,y);
					}
				}
			}
		//EndKids
		from.paint(from)
	}, 
	mouseOut: 	function(from,x,y) 	{
		from.mouseState = "MouseOut"; from.paint(from)
	}, 
	keyDown:	function() 		{
		if(this.keyFocus != null)
		{	this.keyFocus.keyDown(this.keyFocus);
		}
	}	
};	CanvasContainer.setup();
var Button = {
	x:100, y: 100, dx:0, dy:0,width:50,height:20,	
	parent: null, context: null, visible: true,
	text: "Click Me", font: "11pt Calibri",
	backgroundColor: 			"lightblue",	borderColor: "darkgrey", 					textColor: "black",
	mouseOverBackgroundColor: 	"steelblue",	borderOverBackgroundColor: 	"darkgrey",		textOverBackgroundColor: 	"darkgrey",
	mouseDownBackgroundColor: 	"white",		borderDownBackgroundColor: 	"lightblue",		textDownBackgroundColor: 	"steelblue",
	mouseState: 				"MouseOut",
	make: 		function(parent,dx,dy,text){
		var ans = Object.create(Button);
		ans.parent = parent; 		ans.context = parent.context; 
		ans.dx = dx; 				ans.dy = dy; 
		ans.x  = dx + parent.x; 	ans.y = dy + parent.y;
		ans.width = Button.width;	ans.height = Button.height;
		ans.text = text;
		ans.backgroundColor 			= Button.backgroundColor;
		ans.mouseOverBackgroundColor 	= Button.mouseOverBackgroundColor;
		ans.mouseDownBackgroundColor 	= Button.mouseDownBackgroundColor;
		ans.mouseState 					= "MouseOut";
		return ans;
	},
	inside: 	function(from,x,y)	{	
		if( from.x <= x && x < from.x + from.width && 
			from.y <= y && y < from.y + from.height)
			return true;
		else 
			return false;
	},
	paint:		function(from)	{
		from.context.beginPath();
		from.context.font = this.font;
		from.context.textBaseline = 'middle';
		from.context.textAlign = 'center';
		
		from.context.rect(this.x,this.y, this.width, this.height);
		if(from.mouseState == "MouseOver") {	
			from.context.fillStyle   = from.mouseOverBackgroundColor;
			from.context.strokeStyle = from.borderOverBackgroundColor;
			from.context.fill();
			from.context.lineWidth = 2;
			from.context.stroke();
			from.context.fillStyle = from.textOverBackgroundColor;
			from.context.fillText(this.text, this.x + this.width/2, this.y + this.height/2);
		}
		else if (from.mouseState == "MouseOut"){
			from.context.fillStyle 	 = from.backgroundColor;
			from.context.strokeStyle = from.borderColor;
			from.context.fill();
			from.context.lineWidth = 2;
			from.context.stroke();
			from.context.fillStyle = from.textColor;
			from.context.fillText(this.text, this.x + this.width/2, this.y + this.height/2);
		}
		else if (from.mouseState == "MouseClicked"){	
			from.context.fillStyle   = from.mouseDownBackgroundColor;
			from.context.strokeStyle = from.borderDownBackgroundColor;
			from.context.fill();
			from.context.lineWidth = 2;
			from.context.stroke();
			from.context.fillStyle = from.textDownBackgroundColor;
			from.context.fillText(this.text, this.x + this.width/2, this.y + this.height/2);
		}
		
		//End painting background and box
	},
	mouseDown: 	function(from,x,y)	{	
		from.mouseState = "MouseClicked";	from.paint(from); 
		window.setTimeout((function(from){from.mouseState = "MouseOver";	from.paint;})(from),500);
		CanvasContainer.keyFocus = null;
		from.clickedAction(from);
	},
	mouseOver: 	function(from,x,y){
		if(from.inside(from,x,y))
			from.mouseState = "MouseOver"; 
		else
			from.mouseState = "MouseOut";
	},
	keyDown: 	function(from) 	{},
	keyUp: 		function(from) 	{},
	clickedAction: function(from){},
}; 
var RadioButton = {
	x:100, y: 100, dx:0, dy:0, width:50,height: 20,	
	parent: null, context: null, radioGroup: [], visible: true,
	text: "Click Me", font: "11pt Calibri",
	backgroundColor: 			"lightblue",	borderColor: "darkgrey", 					textColor: "black",
	mouseOverBackgroundColor: 	"steelblue",	borderOverBackgroundColor: 	"darkgrey",		textOverBackgroundColor: 	"darkgrey",
	mouseDownBackgroundColor: 	"white",		borderDownBackgroundColor: 	"lightblue",		textDownBackgroundColor: 	"steelblue",
	mouseState: 				"MouseOut",
	make: 		function(parent,dx,dy){
		var ans = Object.create(RadioButton);
		ans.parent = parent; 		ans.context = parent.context; 
		ans.dx = dx; 				ans.dy = dy; 
		ans.x  = dx + parent.x; 	ans.y = dy + parent.y;
		ans.width = RadioButton.width;	ans.height = RadioButton.height;
		ans.backgroundColor 			= RadioButton.backgroundColor;
		ans.mouseOverBackgroundColor 	= RadioButton.mouseOverBackgroundColor;
		ans.mouseDownBackgroundColor 	= RadioButton.mouseDownBackgroundColor;
		ans.mouseState 					= "MouseOut";
		return ans;
	},
	inside: 	function(from,x,y)	{	
		if( from.x <= x && x < from.x + from.width && 
			from.y <= y && y < from.y + from.height)
			return true;
		else 
			return false;
	},
	paint:		function(from)		{
		from.context.beginPath();
		from.context.font = from.font;
		from.context.textBaseline = 'middle';
		from.context.textAlign = 'center';
		
		from.context.rect(this.x,this.y, this.width, this.height);
		if(from.mouseState == "MouseOver") {	
			from.context.fillStyle   = from.mouseOverBackgroundColor;
			from.context.strokeStyle = from.borderOverBackgroundColor;
			from.context.fill();
			from.context.lineWidth = 2;
			from.context.stroke();
			from.context.fillStyle = from.textOverBackgroundColor;
			from.context.fillText(this.text, this.x + this.width/2, this.y + this.height/2);
		}
		else if (from.mouseState == "MouseOut"){
			from.context.fillStyle 	 = from.backgroundColor;
			from.context.strokeStyle = from.borderColor;
			from.context.fill();
			from.context.lineWidth = 2;
			from.context.stroke();
			from.context.fillStyle = from.textColor;
			from.context.fillText(this.text, this.x + this.width/2, this.y + this.height/2);
		}
		else if (from.mouseState == "Selected"){	
			from.context.fillStyle   = from.mouseDownBackgroundColor;
			from.context.strokeStyle = from.borderDownBackgroundColor;
			from.context.fill();
			from.context.lineWidth = 2;
			from.context.stroke();
			from.context.fillStyle = from.textDownBackgroundColor;
			from.context.fillText(this.text, this.x + this.width/2, this.y + this.height/2);
		}
		
		//End painting background and box
	},
	mouseDown: 	function(from,x,y)	{	
		var i; 
		if(from.mouseState == "Selected")
		{	from.mouseState = "MouseOver";
			from.paint(from);
		}
		else
		{	for(i=0;i<from.radioGroup.length;i++)
			{	if(from.radioGroup[i].mouseState == "Selected") 
				{	from.radioGroup[i].mouseState = "MouseOut"
					from.radioGroup[i].paint(from.radioGroup[i]);
				}
			}
			from.mouseState = "Selected";
			from.paint(from);
		}
		CanvasContainer.keyFocus = null;
	},
	mouseOver: 	function(from,x,y)	{ 
		if(from.mouseState != "Selected")
		{	if(from.inside(from,x,y))
				from.mouseState = "MouseOver"; 
			else
				from.mouseState = "MouseOut";
		}
	},
	keyDown: 	function(from) 		{},
}; 
var TextBox = {	
	x:0,y:0,dx:0,dy:0,width:100,height:30, parent: null, contex:null,
	backgroundColor: "white", color: "black", visible: true,
	label: "x:", text: "text",  maxLength: 7, 	cursorPosition:0,
	font: "11pt Calibri", textAlign: "center", 	charSet: CharSets.chars,
	backgroundColor: 			"lightblue",	borderColor: "darkgrey", 					textColor: "black",
	mouseOverBackgroundColor: 	"steelblue",	borderOverBackgroundColor: 	"darkgrey",		textOverBackgroundColor: 	"darkgrey",
	mouseDownBackgroundColor: 	"white",		borderDownBackgroundColor: 	"lightblue",	textDownBackgroundColor: 	"steelblue",
	mouseState: 				"MouseOut",
	
	make: function(parent,dx,dy,label,text){
		var ans = Object.create(TextBox);
		ans.parent = parent; 		ans.context = parent.context; 
		ans.dx = dx; 				ans.dy = dy; 
		ans.x  = dx + parent.x; 	ans.y = dy + parent.y;
		ans.text = text;			ans.label = label;
		ans.width = TextBox.width;	ans.height = TextBox.height;
		ans.backgroundColor 			= TextBox.backgroundColor;
		ans.mouseOverBackgroundColor 	= TextBox.mouseOverBackgroundColor;
		ans.mouseDownBackgroundColor 	= TextBox.mouseDownBackgroundColor;
		ans.mouseState 					= "MouseOut";
		return ans;
	},
	inside: function(from,x,y) {	
		if(from.x <= x && x <= from.x + from.width 
		&& from.y <= y && y <= from.y + from.height)
			return true;
		else
			return false;
	},
	paint:	function(from) {
		from.context.beginPath();
		from.context.font = this.font;
		from.context.textBaseline = 'middle';
		from.context.textAlign = 'from.textAlign';
		
		from.context.rect(from.x,from.y, from.width, from.height);
		if(CanvasContainer.keyFocus == from)
		{	from.context.fillStyle   = from.mouseDownBackgroundColor;
			from.context.strokeStyle = from.borderDownBackgroundColor;
			from.context.fill();
			from.context.lineWidth = 2;
			from.context.stroke();
			from.context.fillStyle = from.textDownBackgroundColor;
			from.context.fillText(from.label + from.text, from.x + from.width/2, from.y + from.height/2);
		}
		else if(from.mouseState == "MouseOver") {	
			from.context.fillStyle   = from.mouseOverBackgroundColor;
			from.context.strokeStyle = from.borderOverBackgroundColor;
			from.context.fill();
			from.context.lineWidth = 2;
			from.context.stroke();
			from.context.fillStyle = from.textOverBackgroundColor;
			from.context.fillText(from.label + from.text, from.x + from.width/2, from.y + from.height/2);
		}
		else if (from.mouseState == "MouseOut"){
			from.context.fillStyle 	 = from.backgroundColor;
			from.context.strokeStyle = from.borderColor;
			from.context.fill();
			from.context.lineWidth = 2;
			from.context.stroke();
			from.context.fillStyle = from.textColor;
			from.context.fillText(from.label + from.text, from.x + from.width/2, from.y + from.height/2);
		}
		else if (from.mouseState == "MouseClicked"){	
			from.context.fillStyle   = from.mouseDownBackgroundColor;
			from.context.strokeStyle = from.borderDownBackgroundColor;
			from.context.fill();
			from.context.lineWidth = 2;
			from.context.stroke();
			from.context.fillStyle = from.textDownBackgroundColor;
			from.context.fillText(from.label + from.text, from.x + from.width/2, from.y + from.height/2);
		}
	}, 
	mouseDown: 	function(from,x,y)	{	
		from.mouseState = "MouseClicked";	from.paint(from);
		window.setTimeout((function(from){from.mouseState = "MouseOver";	from.paint;})(from),500);
		
		CanvasContainer.keyFocus = from;
		from.cursorPosition = from.text.length;
	},
	mouseOver: function(from,x,y)	{
		//console.log("TextBox:mouseOver" + from.mouseState);
		if(from.inside(from,x,y))
			from.mouseState = "MouseOver"; 
		else
			from.mouseState = "MouseOut";
	},
	keyDown: function(from){
		var temptext = "";
		if(from.charSet[event.keyCode] != undefined && from.maxLength > from.text.length)
		{	//from.text = from.text + from.charSet[event.keyCode];
			console.log(from.text.substring(0,from.cursorPosition)); 
			console.log(from.charSet[event.keyCode]);
			console.log(from.text.substring(from.cursorPosition+1,from.text.length));
			
			temptext = from.text.substring(0,from.cursorPosition) 
					 + from.charSet[event.keyCode] 
					 + from.text.substring(from.cursorPosition+1,from.text.length);
			from.cursorPosition = from.cursorPosition + 1;
		}
		else if(event.keyCode == 46) // Delete
			temptext = "";
		else if(event.keyCode == 8) // Backspace
		{	if(from.cursorPosition > 0)
			{	temptext = from.text.substring(0,from.cursorPosition - 1)+ from.text.substring(from.cursorPosition ,from.text.length);
				from.cursorPosition = from.cursorPosition - 1;
			}
		}
		else if(event.keyCode == 37) // Left Arrow
		{	if(from.cursorPosition > 0)
				from.cursorPosition = from.cursorPosition - 1;
			temptext = from.text;
		}
		else if(event.keyCode == 39) // Right Arrow
		{	if(from.cursorPosition > from.text.length)
				from.cursorPosition = from.cursorPosition - 1;
			temptext = from.text;
		}
		else
		{	temptext = from.text;
		}
		from.text = temptext;
		from.paint(from);
	}
};	
var MiniButton = {
	make:	function(parent,dx,dy,text){
		var ans = Object.create(Button);	ans.text = text;
		ans.parent = parent; 		ans.context = parent.context; 
		ans.dx = dx; 				ans.dy = dy; 
		ans.x  = dx + parent.x; 	ans.y = dy + parent.y;
		ans.width = 10;				ans.height = 10;
		ans.backgroundColor 			= Button.backgroundColor;
		ans.mouseOverBackgroundColor 	= Button.mouseOverBackgroundColor;
		ans.mouseDownBackgroundColor 	= Button.mouseDownBackgroundColor;
		ans.mouseState 					= "MouseOut";
		return ans;
	}
};
var SpinBox = {
	x:0, y: 0, dx:200, dy:200,width:70,height:10,	
	parent: null, context: null, visible: true,
	mouseState: "MouseOut",
	down: null, up: null, textBox: null,
	step: 0.1,
	make: 		function(parent,dx,dy,text){
		var ans = Object.create(SpinBox);
		ans.parent = parent; 		ans.context = parent.context; 
		ans.dx = dx; 				ans.dy = dy; 
		ans.x  = dx + parent.x; 	ans.y = dy + parent.y;
		
		ans.down = MiniButton.make(ans,0,0,"-"); 			ans.down.parent = ans;
		ans.textBox = TextBox.make(ans,10,0,text);			ans.textBox.parent = ans;
		ans.up = MiniButton.make(ans,ans.width-10,0,"+");	ans.up.parent = ans;
		ans.textBox.height = 10;
		ans.textBox.width = ans.width - 20;
		ans.textBox.text = "0.00";
		ans.textBox.charSet = CharSets.nums;
		ans.textBox.font = "9pt Calibri"
		ans.textBox.maxLength = 6;
		ans.up.clickedAction = function(from){
			var tBox = from.parent.textBox;
			if(tBox.text == "") tBox.text = from.parent.step;
			else 
			{	tBox.text = Number(tBox.text) + from.parent.step;
			}
		}
		ans.down.clickedAction = function(from){
			var tBox = from.parent.textBox;
			if(tBox.text == "") tBox.text = -from.parent.step;
			else 
			{	tBox.text = Number(tBox.text) - from.parent.step;
			}
		}
		
		return ans;
	},
	paint: function(from)
	{	from.down.paint(from.down);
		from.textBox.paint(from.textBox);
		from.up.paint(from.up);
	},
	inside: function(from,x,y){
		if(from.x <= x && x <= from.x + from.width 
		&& from.y <= y && y <= from.y + from.height)
			return true;
		else
			return false;
	},
	mouseDown: 	function(from,x,y) 	{
		if(from.down.inside(from.down,x,y))
			from.down.mouseDown(from.down,x,y);
		if(from.textBox.inside(from.textBox,x,y))
			from.textBox.mouseDown(from.textBox,x,y);
		if(from.up.inside(from.up,x,y))
			from.up.mouseDown(from.up,x,y);		
		
		window.setTimeout(function(){from.mouseState = "MouseOver";	from.paint(from);},100);
	}, 
	mouseOver: 	function(from,x,y) 	{
		from.down.mouseOver(from.down,x,y);
		from.textBox.mouseOver(from.textBox,x,y);
		from.up.mouseOver(from.up,x,y);
	}, 
	keyDown:	function(from) 		{
		from.textBox.keyDown(from.textBox);
	},	
};
var UI_Canvas =  {	
	x:100, y: 100, dx:0, dy:0,width:100,height:100,	anchor: "topLeft",
	parent: null, context: null, visible: true, kids: [],
	backgroundVisible:    		true, 
	backgroundColor: 			"lightblue",	borderColor: "darkgrey", 					textColor: "black",
	mouseOverBackgroundColor: 	"steelblue",	borderOverBackgroundColor: 	"darkgrey",		textOverBackgroundColor: 	"darkgrey",
	mouseDownBackgroundColor: 	"white",		borderDownBackgroundColor: 	"lightblue",		textDownBackgroundColor: 	"steelblue",
	mouseState: 				"MouseOut",
	make: function(parent,dx,dy,anchor){
		var ans = Object.create(UI_Canvas);
		ans.parent = parent; 			ans.context = parent.context; 
		ans.anchor = anchor;
		
		//Positioning and Dimentions
		ans.dx = dx; 					ans.dy = dy; 
		if 		(anchor == "topLeft")		{ans.x  = dx + parent.x; 							ans.y = dy + parent.y;	}
		else if (anchor == "topRight")		{ans.x  = dx - ans.width + parent.x + parent.width; 	ans.y = dy + parent.y;	}
		else if (anchor == "bottomLeft")	{ans.x  = dx + parent.x; 							ans.y = dy + parent.y + parent.height;	}
		else 								{ans.x  = dx + parent.x + parent.height; 			ans.y = dy + parent.y + parent.height;	}
		ans.width = UI_Canvas.width;	ans.height = UI_Canvas.height;
		//End Positioning and Dimensions
		ans.kids 						= [];
		ans.visible  					= true;
		ans.backgroundVisible			= UI_Canvas.backgroundVisible;
		ans.backgroundColor 			= UI_Canvas.backgroundColor;
		ans.mouseOverBackgroundColor 	= UI_Canvas.mouseOverBackgroundColor;
		ans.mouseDownBackgroundColor 	= UI_Canvas.mouseDownBackgroundColor;
		ans.mouseState 					= "MouseOut";
		return ans;
	},
	reposition: function(from)
	{	if 		(from.anchor == "topLeft")		{from.x  = from.dx + from.parent.x; 									from.y = from.dy + from.parent.y;	}
		else if (from.anchor == "topRight")		{from.x  = from.dx - from.width    + from.parent.x + from.parent.width; from.y = from.dy + from.parent.y;	}
		else if (from.anchor == "bottomLeft")	{from.x  = from.dx + from.parent.x; 									from.y = from.dy + from.parent.y + from.parent.height;	}
		else 									{from.x  = from.dx + from.parent.x + from.parent.height; 				from.y = from.dy + from.parent.y + from.parent.height;	}
	},
	inside: function(from,x,y){
		if(from.x <= x && x <= from.x + from.width 
		&& from.y <= y && y <= from.y + from.height)
			return true;
		else
			return false;
	},
	paint: function(from)
	{	//Paint Background and Box
		if(from.backgroundVisible)
		{	from.context.beginPath();
			from.context.font = this.font;
			from.context.textBaseline = 'middle';
			from.context.textAlign = 'center';
			
			from.context.rect(this.x,this.y, this.width, this.height);
			if(from.mouseState == "MouseOver") {	
				from.context.fillStyle   = from.mouseOverBackgroundColor;
				from.context.strokeStyle = from.borderOverBackgroundColor;
				from.context.fill();
				from.context.lineWidth = 2;
				from.context.stroke();
			}
			else if (from.mouseState == "MouseOut"){
				from.context.fillStyle 	 = from.backgroundColor;
				from.context.strokeStyle = from.borderColor;
				from.context.fill();
				from.context.lineWidth = 2;
				from.context.stroke();
			}
			else if (from.mouseState == "MouseClicked"){	
				from.context.fillStyle   = from.mouseDownBackgroundColor;
				from.context.strokeStyle = from.borderDownBackgroundColor;
				from.context.fill();
				from.context.lineWidth = 2;
				from.context.stroke();
			}
		}
		//End painting background and box
		//Paint Kids
		if(from.kids != null && from.kids != [])
			{	for(i = 0; i < from.kids.length; i++)
				{	if(from.kids[i].visible)  
						from.kids[i].paint(from.kids[i]);
				}
			}
		//End Paint Kids
	},
	mouseDown: function(from,x,y) 
	{	var inAny = false;
		//Kids
			if(from.kids != null && from.kids != [])
			{	for(i in from.kids)
				{	if(from.kids[i].visible && from.kids[i].inside(from.kids[i],x,y))
					{	from.kids[i].mouseDown(from.kids[i],x,y);
						inAny = true;
					}
				}
			}
		//EndKids
		if(!inAny)
		{	from.mouseState = "MouseClicked";	from.paint(from);
			CanvasContainer.keyFocus = null;
		}
		window.setTimeout(function(){from.mouseState = "MouseOver";	from.paint(from);},100);
	},
	mouseOver: function(from,x,y) { var i;
		if(from.inside(from,x,y)) 
			from.mouseState = "MouseOver"; 
		else
			from.mouseState = "MouseOut";
		//Kids
		if(from.kids != null && from.kids != [])
		{	for(i in from.kids)
			{	if(from.kids[i].visible)
					from.kids[i].mouseOver(from.kids[i],x,y);
			}
		}
		//End KidsS

	},
	keyDown: function(from,x,y){
		//Kids
		if(from.kids != null && from.kids != [])
		{	for(i in from.kids)
			{	if(from.kids[i].visible)
					from.kids[i].keyDown(from.kids[i],x,y);
			}
		}
		//End KidsS

	},
	keyUp: function(from){},
};
var HiddenCanvasButton = {	
	x:100, y: 100, dx:0, dy:0, 
	parent: null, context: null, visible: true,
	mouseState: "MouseOut",
	button: null, canvasX: null,
	make: function(parent,dx,dy,text)
	{	var ans = Object.create(HiddenCanvasButton);
		ans.parent = parent; 		ans.context = parent.context; 
		ans.dx = dx; 				ans.dy = dy; 
		ans.x  = dx + parent.x; 	ans.y = dy + parent.y;
		
		ans.button = Button.make(ans,0,0,text); 						ans.button.parent = ans;
		ans.canvasX = UI_Canvas.make(ans,ans.button.width,0,"topLeft");	ans.canvasX.parent = ans;
		ans.canvasX.visible = false;

		return ans;
	},
	inside: function(from,x,y){	
		if(from.button.inside(from.button,x,y)) 
			return true;
		if(from.canvasX.visible && from.canvasX.inside(from.canvasX,x,y))
			return true;
		return false;
	},
	paint: function(from){
		from.button.paint(from.button);
		if(from.canvasX.visible)
		{	//console.log("Here");
			from.canvasX.paint(from.canvasX);
		}
	},
	mouseDown: function(from,x,y) {
		if(from.button.visible && from.button.inside(from.button,x,y))
			from.button.mouseDown(from.button,x,y);
		if(from.canvasX.visible && from.canvasX.inside(from.canvasX,x,y))
			from.canvasX.mouseDown(from.canvasX,x,y);
	},
	mouseOver: function(from,x,y){
		from.button.mouseOver(from.button,x,y);
		if(from.button.inside(from.button,x,y))
			from.canvasX.visible = true;
		else
		{	if(!from.canvasX.inside(from.canvasX,x,y))
				from.canvasX.visible = false;
		}

		if(from.canvasX.visible)
			from.canvasX.mouseOver(from.canvasX,x,y);		
	},
	keyDown: function(from,x,y)
	{ if(from.canvasX.visible)
		from.canvasX.visible.keyDown(from.canvasX.visible,x,y);
	},
	keyUp: function(from){},
};

// Send Data
// Recieve Data
var testButton = RadioButton.make(CanvasContainer,100,100);
var testButton1 = RadioButton.make(CanvasContainer,220,80);
var testButton2 = RadioButton.make(CanvasContainer,340,100);
var testText = TextBox.make(CanvasContainer,100,220,"y:", "0.00");
var smButton = MiniButton.make(CanvasContainer,200,200,"+");
var spinBox = SpinBox.make(CanvasContainer,250,205,"x:");
var ui_canvas = UI_Canvas.make(CanvasContainer,350,200,"topLeft");
var testButton4 = Button.make(ui_canvas,10,10,"In Canvas");
var hiddenCanvasButton = HiddenCanvasButton.make(CanvasContainer,10,10,"File");
var testButton5 = Button.make(hiddenCanvasButton.canvasX,10,10,"Hidden");

testButton.radioGroup =  [testButton, testButton1, testButton2];
testButton1.radioGroup = [testButton, testButton1, testButton2];
testButton2.radioGroup = [testButton, testButton1, testButton2]; 
CanvasContainer.kids[0] = testButton;
CanvasContainer.kids[1] = testButton1;
CanvasContainer.kids[2] = testButton2;
CanvasContainer.kids[3] = testText;
CanvasContainer.kids[4] = smButton;
CanvasContainer.kids[5] = spinBox;
CanvasContainer.kids[6] = ui_canvas;
CanvasContainer.kids[6].kids[0] = testButton4;
CanvasContainer.kids[7] = hiddenCanvasButton;
CanvasContainer.kids[7].canvasX.kids[0] = testButton5;

//|Top Right Interface
var northEastCanvas = UI_Canvas.make(CanvasContainer, -15, 15, "topRight");		CanvasContainer.kids[0] = northEastCanvas;
northEastCanvas.width = 50; 	northEastCanvas.height = 280; //nortEastCanvas.backgroundVisible = false;
northEastCanvas.reposition(northEastCanvas);

var northMiniButton 	= MiniButton.make(northEastCanvas,20, 0,"^");			northEastCanvas.kids[0] = northMiniButton;				
var southMiniButton 	= MiniButton.make(northEastCanvas,20,40,"v");			northEastCanvas.kids[1]= southMiniButton;				
var eastMiniButton 		= MiniButton.make(northEastCanvas, 0,20,"<");			northEastCanvas.kids[2] = eastMiniButton;				
var westMiniButton 		= MiniButton.make(northEastCanvas,40,20,">");			northEastCanvas.kids[3] = westMiniButton;				
var xOffsetTextBox 		= TextBox.make(northEastCanvas, 0,10,"x:","0.00");		northEastCanvas.kids[4] = xOffsetTextBox;	
	xOffsetTextBox.width = 50;	xOffsetTextBox.height = 10; 	 			
var yOffsetTextBox 		= TextBox.make(northEastCanvas, 0,30,"y:","0.00");		northEastCanvas.kids[5] = yOffsetTextBox;				
	yOffsetTextBox.width = 50;	yOffsetTextBox.height = 10; 
var zoomSpinBox			= SpinBox.make(northEastCanvas,-10,60, "z:");			northEastCanvas.kids[6] = zoomSpinBox;
var rotationSpinBox		= SpinBox.make(northEastCanvas,-10,80, "r:");			northEastCanvas.kids[7] = rotationSpinBox;
	rotationSpinBox.down.text = "v"; rotationSpinBox.up.text = "^";

var rowRadioButton		= RadioButton.make(northEastCanvas,0,110);				northEastCanvas.kids[8] = rowRadioButton;
var laneRadioButton		= RadioButton.make(northEastCanvas,0,140);				northEastCanvas.kids[9] = laneRadioButton;
var nodeRadioButton		= RadioButton.make(northEastCanvas,0,170);				northEastCanvas.kids[10] = nodeRadioButton;
var noGoRadioButton		= RadioButton.make(northEastCanvas,0,200);				northEastCanvas.kids[11] = noGoRadioButton;
var imageRadioButton	= RadioButton.make(northEastCanvas,0,230);				northEastCanvas.kids[12] = imageRadioButton;
var delRadioButton		= RadioButton.make(northEastCanvas,0,260);				northEastCanvas.kids[13] = delRadioButton;

	rowRadioButton.text = "Row";		rowRadioButton.radioGroup =   [rowRadioButton, laneRadioButton, nodeRadioButton, noGoRadioButton, imageRadioButton, delRadioButton];
	laneRadioButton.text = "Lane";		laneRadioButton.radioGroup =  [rowRadioButton, laneRadioButton, nodeRadioButton, noGoRadioButton, imageRadioButton, delRadioButton];
	nodeRadioButton.text = "Node";		nodeRadioButton.radioGroup =  [rowRadioButton, laneRadioButton, nodeRadioButton, noGoRadioButton, imageRadioButton, delRadioButton];
	noGoRadioButton.text = "NoGo";		noGoRadioButton.radioGroup =  [rowRadioButton, laneRadioButton, nodeRadioButton, noGoRadioButton, imageRadioButton, delRadioButton];
	imageRadioButton.text = "Image";	imageRadioButton.radioGroup = [rowRadioButton, laneRadioButton, nodeRadioButton, noGoRadioButton, imageRadioButton, delRadioButton];
	delRadioButton.text = "Del";		delRadioButton.radioGroup =   [rowRadioButton, laneRadioButton, nodeRadioButton, noGoRadioButton, imageRadioButton, delRadioButton];

//End Top Right Interface
CanvasContainer.paint(CanvasContainer);