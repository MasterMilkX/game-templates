//set up the canvas
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

var scale = 10;
var spriteSize = 8;
var pixelSize = spriteSize*scale;

//background/level
var curLevel = {
	name : "home",
	img : null,			//replace with background image
	ready : true,

	width: 15*pixelSize,
	height: 2*pixelSize
};
let t_offset = pixelSize;
let b_offset = t_offset+curLevel.height;

//player [REPLACE ALL INSTANCES OF "KYLE" WITH WHATEVER YOUR MC NAME IS]
var kyleIMG = new Image();
kyleIMG.src = "../sprites/kyle_side.png";
var kyleReady = false;
kyleIMG.onload = function(){kyleReady = true;};

var kyle = {
	name : "kyle",

	width : pixelSize,
	height : pixelSize,
	dir : "right",
	action : "idle",
	img : kyleIMG,
	ready : kyleReady,

	//movement
	x : 0 * pixelSize,
	y : 1 * pixelSize, 
	speed : 3,
	show : true,

	//other properties
	canInteract : true,
	curObject : null,
	canMove : true,


	//animation
	anim : 0,
	at : 0
}

// npcs

var npcIMG = new Image();
npcIMG.src = "../sprites/side_template1.png";
var npcReady = false;
npcIMG.onload = function(){npcReady = true;};
var ai = {
	name : "AI",

	//sprite properties
	width : pixelSize,
	height : pixelSize,
	dir : "left",
	action : "hop",
	img : npcIMG,
	ready : npcReady,

	//movement
	x : 7 * pixelSize,
	y : 1 * pixelSize,
	show : true,
	interact : false,

	anim : 0,
	at : 0
}
var npcs = [ai];


//items

var couch = {
	name : "couch",
	text : ["It's a couch!", "Not really... | it's just a rectangle", "Use your imagination!"],
	x : 2*pixelSize,
	y: 1*pixelSize,
	width : 2*pixelSize,
	height : pixelSize,
	active : true
};

var items = [couch]


/////////   GAME DIALOG  ////////

var story = {
	storyObj : [],
	taskIndex : 0,
	trigger : "none",
	interaction : false,
	randResp : -1,

	cutscene : false,
	pause : false,

	dialogue : {
		text : [""],
		index : 0,
		show : false
	},

	choice_box : {
		options : [],
		index : 0,
		lines : [],
		show : false
	}
};


//camera
var camera = {
	x : 0,
	y : 0
};

//"invisible walls" to prevent movement
// should be binary 2d array with cell size = pixelsize
//var collision_map = [];
var collision_map = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,1,0]
];

//KEYS

// directionals
var upKey = 38;     //[Up]
var leftKey = 37;   //[Left]
var rightKey = 39;  //[Rigt]
var downKey = 40;   //[Down]
var moveKeySet = [upKey, leftKey, rightKey, downKey];

// A and b
var a_key = 90;   //[Z]
var b_key = 88;   //[X]
var actionKeySet = [a_key, b_key];

var keys = [];



//////////////////    GENERIC FUNCTIONS   ///////////////


//checks if an element is in an array
function inArr(arr, e){
	if(arr.length == 0)
		return false;
	return arr.indexOf(e) !== -1
}


//check if colliding pixels
function colliding(obj1, obj2){

	//get bounding box area
	var xArea1 = [];
	for(var z=0;z<obj1.width;z++){
		xArea1.push(obj1.x+z);
	}
	var yArea1 = [];
	for(var z=0;z<obj1.height;z++){
		yArea1.push(obj1.y+z);
	}

	var xArea2 = [];
	for(var z=0;z<obj2.width;z++){
		xArea2.push(obj2.x+z);
	}
	var yArea2 = [];
	for(var z=0;z<obj2.height;z++){
		yArea2.push(obj2.y+z);
	}

	//find overlap
	var xOver = false;
	for(var a=0;a<xArea1.length;a++){
		if(inArr(xArea2, xArea1[a])){
			xOver = true;
			break;
		}
	}
	var yOver = false;
	for(var b=0;b<yArea1.length;b++){
		if(inArr(yArea2, yArea1[b])){
			yOver = true;
			break;
		}
	}

	return xOver && yOver;
}


function pixPos(p){
	return Math.round(p / pixelSize);
}


////////////////   KEYBOARD FUNCTIONS  //////////////////


// key events
var keyTick = 0;
var kt = null; 

function anyKey(){
	return anyMoveKey() || anyActionKey();
}

//check if any directional key is held down
function anyMoveKey(){
	return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey])
}

function anyActionKey(){
	return (keys[a_key] || keys[b_key]);
}


//handle keyboard interactions (movement)
function keyboard(){
	if(!kyle.interact && !story.cutscene){
		if(kyle.show){
			if(keys[rightKey]){
				kyle.dir = "right";
				kyle.action = "move";
	
				//move
				if((kyle.x + kyle.width) < curLevel.width && !hit(kyle, "right")){
					kyle.x += kyle.speed;
					kyle.action = "move";
				}else{
					kyle.action = "idle";
				}
	
			}else if(keys[leftKey]){
				kyle.dir = "left";
	
				//move
				if(kyle.x > 0 && !hit(kyle, "left")){
					kyle.x -= kyle.speed;
					kyle.action = "move";
				}else{
					kyle.action = "idle";
				}
			}
	
	
			//default to idle action
			if(!anyKey())
				kyle.action = "idle";
		}
	}
}


//action and interaction keys
var reInteract = true;
var cutT = 0;
function action_keys(){
	//interact [Z]
	var dialogue = story.dialogue;
	if(keys[a_key] && !kyle.interact && kyle.action != "move" && normal_game_action()){
		//npcs
		for(var i=0;i<npcs.length;i++){
			if(canTalk(npcs[i])){
				story.trigger = "talk_" + npcs[i].name;

				//setup
				reInteract = false;
				kyle.other = npcs[i];
				kyle.other.interact = true;
				kyle.interact = true;

					dialogue.index = 0;
					narrative();
					typewrite();
				return;
			}
		}

		//items
		for(var i=0;i<items.length;i++){
			if(canInteract(items[i]) && items[i].text){
				story.trigger = "touch_" + items[i].name;
				reInteract = false;
				kyle.other = items[i];
				kyle.interact = true;

				dialogue.index = 0;
				narrative();
				typewrite();
				return;
			}
		}
	}
	//finished current dialogue text
	else if(keys[a_key] && dialogue.show && reInteract && !texting){
		var other = kyle.other;
		reInteract = false;
		//end of dialogue
		if(dialogue.index +1 == dialogue.text.length){
			kyle.interact = false;

			//select item if options showing
			if(story.choice_box.show){
				story.trigger = "> " + story.choice_box.options[story.choice_box.index];
				story.taskIndex++;
				dialogue.index = 0;
				narrative();
				typewrite();
				return;
			}

			//normal reset
			if(!story.cutscene){
				kyle.other.interact = false;
				if(jump !== -1){
					kyle.other.text_index = jump;
					jump = -1;
				}
				dialogue.index = 0;
			}else{
				story.taskIndex++;
				//dialogue.index = 0;
				narrative();
			}
		}
		//still more dialogue left
		else{
			kyle.other.text_index++;
			dialogue.index++;
			typewrite();
		}
	}
	//increase typewriter speed 
	else if(keys[a_key] && dialogue.show && texting){
		text_speed = 30;
		reInteract = false;
	}

}

function normal_game_action(){
	return (!story.cutscene && reInteract && !story.pause);
}


///////////////////        AI         ////////////////////


//allow the npcs to randomly move around
function npcMove(){
	for(var i=0;i<npcs.length;i++){
		var n = npcs[i];
		if(n.show && n.move != null && n.move){
			var change = npcSpeed * (n.dir == "left" ? -1 : 1);
			if((n.x + change >= 0) && ((n.x + n.width + change) < curLevel.width))
				n.x += change;
		}
	}
}

//make the npc face a certain target
function npcFace(){

	for(var i=0;i<npcs.length;i++){
		var n = npcs[i];
		if(!n.interact && n.show && n.action == "face" && n.target != null){
			if(n.target.x > n.x)
				n.dir = "right";
			else
				n.dir = "left";
		}
	}
}

//the talk function - sees if npc is within talking range of the player
function canTalk(other){
	if(other.anim == 1 || !other.show)
		return false;

	//get the positions
	if(kyle.dir == "left"){
		if((other.x+other.width) > (kyle.x - pixelSize) && ((other.x+other.width) <= (kyle.x+kyle.width)) 
			&& (other.y > (kyle.y-(pixelSize/2)) && other.y < (kyle.y+(pixelSize/2))))
			return true;
		else
			return false;
	}else if(kyle.dir == "right"){
		if((other.x < (kyle.x +kyle.width + pixelSize)) && (other.x >= (kyle.x)) 
			&& (other.y > (kyle.y-(pixelSize/2)) && other.y < (kyle.y+(pixelSize/2))))
			return true;
		else
			return false;
	}
}


//characters behave a certain way
function ai_action(){
	npcMove();
	npcFace();
}



////////////////    OBJECT INTERACTION   ///////////////

//any hit
function hit(sprite, dir){
	if(hitBoundary(sprite, dir))
		return true;
}

//chek if the player is colliding with a collision tile
function hitBoundary(sprite, dir){
	if(collision_map.length == 0)
		return false;
	
	if(dir == "up"){
		var closest = Math.floor((sprite.y - sprite.speed) / (pixelSize));
		if(closest < 0 || collision_map[closest][Math.round(sprite.x/pixelSize)] == 1)
			return true;
		else
			return false;
	}
	else if(dir == "down"){
		var closest = Math.ceil((sprite.y + sprite.speed) / (pixelSize));
		if(closest >= collision_map.length || collision_map[closest][Math.round(sprite.x/pixelSize)] == 1)
			return true;
		else
			return false;
	}
	else if(dir == "left"){
		var closest = Math.floor((sprite.x - sprite.speed) / (pixelSize));
		if(closest < 0 ||  collision_map[Math.round(sprite.y/pixelSize)][closest] == 1)
			return true;
		else
			return false;
	}else if(dir == "right"){
		var closest = Math.ceil((sprite.x + sprite.speed) / (pixelSize));
		if(closest >= collision_map[0].length ||  collision_map[Math.round(sprite.y/pixelSize)][closest] == 1)
			return true;
		else
			return false;
	}
	
}

//determine which object a character is in front of
function getObjInteraction(character){
	var midpt = Math.round((character.x + (character.width / 2)));
	for(var o=0;o<items.length;o++){
		var obj = items[o];
		if((obj.x < midpt && (obj.x + obj.width) > midpt))
			return obj;
	}
	return null;
}


//the item interaction function - sees if item is within interaction range of the player
function canInteract(other){
	if(!other.active)
		return false;

	//get the positions
	if(kyle.dir == "left"){
		var b = kyle.x;
		var b2 = (kyle.x - (pixelSize/2));
		if((other.x <= b) && ((other.x+other.width) > b2) && (other.y > (kyle.y-(pixelSize/2)) && other.y < (kyle.y+(pixelSize/2))))
			return true;
		else
			return false;
	}else if(kyle.dir == "right"){
		var b = kyle.x + kyle.width;
		var b2 = (kyle.x + kyle.width + (pixelSize/2));
		if((other.x <= b2) && ((other.x + other.width) >= b) && (other.y > (kyle.y-(pixelSize/2)) && other.y < (kyle.y+(pixelSize/2))))
			return true;
		else
			return false;
	}
}



////////////////   CAMERA FUNCTIONS   /////////////////

let camMove = (canvas.width / 2)-pixelSize/2;		//just after halfway point

//have the camera follow the player (side scrolling)
function panCamera(){

	if(curLevel.ready){
		//camera displacement
		if((kyle.x >= camMove) && ((kyle.x+pixelSize) <= (curLevel.width - camMove)))
			camera.x = kyle.x - camMove;
	}
	
}

//reset the camera's position on the player
function resetCamera(){
	camera.x = 0;
	camera.y = 0;

	if(kyle.x > (curLevel.width - camMove))
		camera.x = curLevel.width - canvas.width;

}


//////////////////  RENDER FUNCTIONS  ////////////////////

//make sure all sprites are imported
function checkRender(){
	if(!kyle.ready || !kyle.img.width <= 0)
		kyle.img.onload = function(){kyle.ready = true;};

	for(let i=0;i<npcs.length;i++){
		let npc = npcs[i];
		if(!npc.ready || !npc.img.width <= 0)
			npc.img.onload = function(){npc.ready = true;};
	}
}

//draw everything on the canvas
function render(){
	ctx.save();
	ctx.translate(-camera.x, -camera.y);		//camera
	ctx.clearRect(camera.x, camera.y, canvas.width, canvas.height);
	
	//background
	ctx.fillStyle = "#dedede";
	ctx.fillRect(0,0,canvas.width, canvas.height);

	//draw bounding area
	ctx.fillStyle = "#000";
	ctx.fillRect(camera.x,0,canvas.width,t_offset);
	ctx.fillRect(camera.x,b_offset,canvas.width,canvas.height-(b_offset));
	
	/*   add draw functions here  */
	checkRender();

	//draw characters
	drawChar(kyle);

	for(let i=0;i<npcs.length;i++){
		drawChar(npcs[i]);
	}

	//draw items

	//debug
	drawCollisionDebug();
	drawItemDebug();

	drawDialog();

	
	ctx.restore();
}

//combined sprite render function
function drawChar(c){
	updateSprite(c);
	renderSprite(c);
}

//animation for sprite
function updateSprite(sprite){
	//cancel animation if interacting
	if(sprite.interact){
		sprite.anim = 0;
		clearInterval(sprite.at);
		sprite.at = 0;
		return;
	}

	//normal sprite movement
	if(sprite.action == "move" && sprite.at == 0){
		sprite.at = setInterval(function(){
			sprite.anim = (sprite.anim == 0 ? 1 : 0);
		}, 150);
	}else if(sprite.action == "idle"){
		clearInterval(sprite.at);
		sprite.anim = 0;
		sprite.at = 0;
	}

	//npc action

	//hop
	else if(sprite.action == "hop" && sprite.at == 0){
		sprite.at = setInterval(function(){
			sprite.anim = 1;
			setTimeout(function(){sprite.anim = 0;}, 100);
		}
		,250*(Math.floor(Math.random() * 3) + 3));
	}

	//jump (move+hop)
	else if(sprite.action == "jump" && sprite.at == 0){
		sprite.at = setInterval(function(){
			sprite.dir = (Math.round(Math.random()) == 0 ? "left" : "right");
			sprite.anim = 1;
			sprite.move = true;
			setTimeout(function(){sprite.anim = 0; sprite.move = false;}, 100);
		}, 250*(Math.floor(Math.random() * 3) + 6));
	}

}

//draw the sprite on the canvas with the current animation
function renderSprite(sprite){
	if(sprite.show && sprite.ready){
		ctx.drawImage(sprite.img,
			sprite.width*sprite.anim, sprite.height*(sprite.dir == "left" ? 1 : 0)+1,
			sprite.width, sprite.height,
			sprite.x, sprite.y+t_offset,
			pixelSize, pixelSize
			);
	}
}

//show collision areas as debug
function drawCollisionDebug(){
	ctx.fillStyle = "#ff0000";
	for(var y =0; y < collision_map.length;y++){
		for(var x =0;x<collision_map[y].length;x++){
			if(collision_map[y][x] == 1)
				ctx.fillRect(x*pixelSize,y*pixelSize+t_offset, pixelSize, pixelSize);
		}
	}
}

//show item bounding area debug
function drawItemDebug(){
	for(var a=0;a<items.length;a++){
		var i = items[a];
		if(i.active){
			//ctx.fillRect(i.x,i.y, i.width,i.height);
			ctx.beginPath();
			ctx.lineWidth = 3;
			if(i.debugColor)
				ctx.strokeStyle = i.debugColor;
			else
				ctx.strokeStyle = "#00ff00";
			ctx.rect(i.x, i.y+t_offset, i.width, i.height);
			ctx.stroke();
		}
	}
}


//////////////   GAME LOOP FUNCTIONS   //////////////////

//game initialization function
function init(){

}

//main game loop
function main(){
	requestAnimationFrame(main);
	canvas.focus();

	panCamera();
	keyboard();
	action_keys();

	ai_action();

	render();

	//keyboard ticks
	var akey = anyKey();
	if(akey && kt == 0){
		kt = setInterval(function(){keyTick+=1}, 75);
	}else if(!akey){
		clearInterval(kt);
		kt = 0;
		keyTick=0;
	}

	//debug
	var settings = "< Side Scroller >";
	if(document.getElementById('debug'))
		document.getElementById('debug').innerHTML = settings;
}


/////////////////   HTML5 FUNCTIONS  //////////////////


//check for keydown on choice box selection
document.body.addEventListener("keydown", function (e) {
	//scroll through the options to choose for dialog
	if(story.cutscene && story.choice_box.show){
		var c = story.choice_box;
		if(e.keyCode == downKey || e.keyCode == rightKey)
			story.choice_box.index = (c.index + 1) % c.options.length;
		else if(e.keyCode == upKey || e.keyCode == leftKey)
			story.choice_box.index = ((c.index + c.options.length) - 1) % c.options.length;
	}
});

//determine if valud key to press
document.body.addEventListener("keydown", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = true;
	}else if(inArr(actionKeySet, e.keyCode)){
		keys[e.keyCode] = true;
	}
});

//check for key released
document.body.addEventListener("keyup", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = false;
	}else if(inArr(actionKeySet, e.keyCode)){
		keys[e.keyCode] = false;
		reInteract = true;
		text_speed = 60;
	}
});

//prevent scrolling with the game
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if(([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)){
        e.preventDefault();
    }
}, false);


main();
