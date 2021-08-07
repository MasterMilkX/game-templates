
//SETUP
var size = 16;

//area for collision (x and y are relative to the object starting from the top right)
function boundArea(x, y, w, h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}


function getIMGNPC(name){
  var charIMG = new Image();
  charIMG.src = "../../sprites/" + name + ".png";
  var charReady = false;
  charIMG.onload = function(){charReady = true;};

  this.img = charIMG;
  this.ready = charReady;

}


function npc(x, y, text, skin){
	this.name = "???";
	this.x = x*story.size;
	this.y = y*story.size;
  	//sprite properties
	this.width = 16;
	this.height = 16;
	this.dir = "north";
	this.action = "idle";

	//movement
  	this.speed = 1;
  	this.initPos = 0;
  	this.moving = false;
  	this.velX = 0;
 	this.velY = 0;

	//other properties
	this.text = text;
	this.text_index = 0;
	this.interact = false;
	this.move = "drunk_walk";
	this.boundary;				//confined space to walk in
	this.wt = 0;

	var set = new getIMGNPC(skin);
	this.img = set.img;
	this.ready = set.ready;
	this.show = true;

	//properties specific to the same spritesheet as kyle_rpg.png (pokemon gen 2)
	this.curFrame = 0;
	this.fpr = 3;
	this.fps = 9;
	this.offsetX = 0;
	this.offsetY = 0;

	//walk animation
	this.idleNorth = [10,10,10,10];
	this.idleSouth = [1,1,1,1];
	this.idleWest = [4,4,4,4];
	this.idleEast = [7,7,7,7];

	//movement animation
	this.moveNorth = [9,10,11,10];
	this.moveSouth = [0,1,2,1];
	this.moveWest = [3,4,5,4];
	this.moveEast = [6,7,8,7];

	this.seqlength = 4;
	this.curFrame = 0;
	this.ct = 0;
}


var ai = new npc(7,7,["Hello! Welcome to...", "The RPG Template!<0>"], "npc_template_2_full");