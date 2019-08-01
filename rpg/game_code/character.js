
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
  charIMG.src = "../sprites/" + name + ".png";
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
	this.boundary;
	this.wt = 0;

	var set = new getIMGNPC(skin);
	this.img = set.img;
	this.ready = set.ready;
	this.show = true;
}