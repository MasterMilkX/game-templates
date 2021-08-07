//////////////////// ITEM ///////////////////

function getIMGITEM(name){
	var itemIMG = new Image();
	itemIMG.src = "../sprites/items/" + name + ".png";
	var itemReady = false;
	itemIMG.onload = function(){itemReady = true;};

	this.img = itemIMG;
	this.ready = itemReady;
}

//define an animation for the item
function animateITEM(w, h, sequenceSet, fps, fpr){
	this.width = w;
	this.height = h;
	this.sequenceSet = sequenceSet;
	this.fps = fps;            //frame speed
  	this.fpr = fpr;            //# of frames per row
  	this.ct = 0;
  	this.curFrame = 0;
	this.curSeq = sequenceSet[0];
}

function animSet(name, sequence){
	this.name = name;
	this.sequence = sequence;
}

function ITEM(name, x, y, ba=null, text=null, thru=false, show=true, animation=null){
	var set = new getIMGITEM(name);

	this.name = name;
	this.x = x;
	this.y = y;
	this.area = ba;
	this.text = text;
	this.thru = thru;		//show over the player or not
	this.show = show;
	this.animation = animation;

	this.img = set.img;
	this.ready = set.ready;
}

//area for collision (x and y are relative to the object starting from the top right)
function boundArea(x, y, w, h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

//retrieve item by name
function getItembyName(name){
	for(var i=0;i<items.length;i++){
		var item = items[i];
		if(item.name === name)
			return item;
	}
	return null;
}

//set the item's animation
function setItemSeq(item, name){
	for(var i=0;i<item.animation.sequenceSet.length;i++){
		var seq = item.animation.sequenceSet[i];
		if(seq.name == name){
			item.animation.curSeq = seq;
			return;
		}
	}

	console.log(name + " not found in item:" + item.name);
}


var cloud = new ITEM("clouds", 10, 5, null, null, true, true, 
	new animateITEM(16, 16, [new animSet("seq", [0,2,4,3,1])], 32, 5));
var tv = new ITEM("tv", 13, 6, new boundArea(0, 0, 1, 2), ["The TV's unplugged"], false, true, 
		 	new animateITEM(16, 32, [new animSet("off", [0]), new animSet("on", [1])], 2, 2))
var trash_fire = new ITEM("trash_fire", 4, 7, new boundArea(0,0,1,1), ["Wow! Fire!", "It's toasty..."], false, true,
	new animateITEM(16,16, [new animSet("seq", [0,1])], 10, 2))
var pizza_box = new ITEM("pizza_box", 13,12, new boundArea(0,0,1,1), ["You check the pizza box", "A single slice is left"])

var items = [cloud, tv, trash_fire, pizza_box]
