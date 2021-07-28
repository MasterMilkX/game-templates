//////////////          DIALOG          ////////////////


//dialog gui
var dialogIMG = new Image();
dialogIMG.src = '../sprites/gui/dialog.png';
var dialogReady = false;
dialogIMG.onload = function(){dialogReady = true;};

var optionIMG = new Image();
optionIMG.src = "../sprites/gui/choice_box.png";
var optionReady = false;
optionIMG.onload = function(){optionReady = true;};

var selectIMG = new Image();
selectIMG.src = "../sprites/gui/select_box.png";
var selectReady = false;
selectIMG.onload = function(){selectReady = true;};



var choiceOffsetY = 255;

//show dialog gui
function drawDialog(){
	var dialogue = story.dialogue;
	var choice = story.choice_box;

	var textScale = (canvas.height / 400);


	if(dialogue.show && dialogReady){
		ctx.drawImage(dialogIMG, camera.x, camera.y, canvas.width, canvas.height);
		//wrapText(dialogue.text[dialogue.index], camera.x + 12, camera.y + 116)
		showText();

		if(choice.show){
			//get the maximum x length
			var longest = 10;
			if(!hasMultiLine()){
				longest = bigChoice(choice.options);
			}else{
				longest = bigMultiChoice(choice.options);
			}

			//choice boxes
			var cx = camera.x+(15*textScale);
			for(var c=0;c<choice.options.length;c++){
				var cy = (camera.y+(choiceOffsetY*textScale))-((((optionIMG.height*textScale)-2)/2)*(sumLines(c)));

				//var cy = camera.y+95+(-(optionIMG.height-1)*((sumLines(c)*11)+1));
				ctx.drawImage(optionIMG, 0,0, optionIMG.width, optionIMG.height, 
								cx, cy, (longest/10)*(optionIMG.width)*textScale, (choice.lines[c]/2)*optionIMG.height*textScale);
				choiceText(choice.options[c], choice.lines[c], cy+(25*textScale));

				//ctx.font = "6px Gameboy";
				//ctx.fillText(choice.options[choice.options.length-(c+1)], cx+4, cy+9);
			}

			//select
			var cy2 = (camera.y+(choiceOffsetY*textScale))-(((optionIMG.height*textScale)-2)/2)*(sumLines(choice.index));
			//((((optionIMG.height-2)/2)*(sumLines(choice.index)))*(choice.index-choice.options.length)), 

			ctx.drawImage(selectIMG, 0,0, selectIMG.width, selectIMG.height, 
								cx, cy2,
								(longest/10)*(selectIMG.width)*textScale, (choice.lines[choice.index]/2)*selectIMG.height*textScale);
		}
		
	}
}

//find the longest line of text
function bigChoice(arr){
	var longest = 0;
	for(var i=0;i<arr.length;i++){
		longest = (arr[i].length > longest ? arr[i].length : longest);
	}
	return longest+1;
}

function bigMultiChoice(arr){
	var lines = [];
	for(var c=0;c<arr.length;c++){
		var segs = arr[c].split(" | ");
		for(var d=0;d<segs.length;d++)
			lines.push(segs[d]);
	}
	//console.log(lines);

	return bigChoice(lines);
}

//wrap the text if overflowing on the choice box
function choiceText(text, lines, y) {
	var texts = text.split(" | ");
	var textScale = (canvas.height / 400);
	ctx.font = "6px Gameboy";
	ctx.fillStyle = "#000000";
	for(var l=0;l<lines;l++){
		ctx.fillText(texts[l], camera.x+(25*textScale), y+(l*25*textScale));
	}
}	

//
function sumLines(i){
	var lines = story.choice_box.lines;
	var sum = 0;
	for(var l=i;l<lines.length;l++){
		sum += lines[l];
	}
	return sum;
}

function hasMultiLine(){
	for(var l=0;l<story.choice_box.lines.length;l++){
		if(story.choice_box.lines[l] > 1)
			return true;
	}
	return false;
}



function drawGUI(){
	drawDialog();
}

//typewriter functions
var tw = 0;
var curLine = 0;						//current line index
var curText = "";
var text_speed = 50;
var text_time = 0;					//typewriter effect
var texting = false;				//currently typing
var lineTexts = ["", ""];		//the two lines that can be shown on screen
var maxWidth = 140;
var lineHeight = 30;
var jump = -1;

function typewrite(){	
	//pre-processing and reset
	if(!texting){
		curText = story.dialogue.text[story.dialogue.index];		//set the text to the NPC or item text 
		if(!curText)
			return;

		//check if section jump
		if(jump == -1){
			var jumper = curText.match(/<[0-9]+>/g);
			if(jumper){
				curText = curText.replace(/<[0-9]+>/g, "");
				jump = parseInt(jumper[0].replace(/[<>]/g, ""));
			}
		}
		curText = curText.replace(/<[0-9]+>/g, "");		//catch the stragler
		tw = 0;
		//console.log("restart")
		curLine = 0;
		clearText();
		ctx.font = "12px Courier";
		ctx.fillStyle = "#000000";
		texting = true;
	}
	if(tw < curText.length){
		//if at a new line reset
		if(curText[tw] === "|"){
			tw++;
			curLine++;
			if(curLine > 1){
				lineTexts[0] = lineTexts[1];
				lineTexts[1] = "";
			}
		}
		//append letters
		else{
			if(curLine == 0)
				lineTexts[0] += curText[tw];
			else
				lineTexts[1] += curText[tw];
		}
		text_time = setTimeout(typewrite, text_speed);
		tw++;
	}else{
		texting = false;
		clearTimeout(text_time);
		//console.log("done");
	}
}

function clearText(){
	lineTexts[0] = "";
	lineTexts[1] = "";
	clearTimeout(text_time);
}

function showText(){
	var textScale = (canvas.height / 400);
	ctx.fillStyle = "#000000";
	ctx.fillText(lineTexts[0], camera.x + 32 * textScale, camera.y + (320 * textScale));
	ctx.fillText(lineTexts[1], camera.x + 32 * textScale, camera.y + ((320 + lineHeight) * textScale));
}


////////////////////		STORY  		/////////////////////

function newDialog(dialogue){
	if(story.dialogue.text != dialogue){
		story.dialogue.text = dialogue;
		story.dialogue.show = true;
		story.dialogue.index = 0;
	}
	
}

//count the lines from each choice given
function countChoice(){
	var choice = story.choice_box;
	var lines = [];
	for(var c=0;c<choice.options.length;c++){
		lines.push(choice.options[c].split(" | ").length);
	}
	choice.lines = lines;
}

//make new choice boxes
function newChoice(options){
	story.choice_box.show = true;
	story.choice_box.options = options;
	countChoice();
}

//reset the choice options
function endChoice(){
	story.choice_box.show = false;
	story.choice_box.index = 0;
	story.choice_box.lines = [];
}

//reset the gui and cutscene stuff within the game
function endScene(){
	story.taskIndex = 0;
	story.dialogue.show = false;
	story.dialogue.text = [""];
	story.choice_box.show = false;
	story.cutscene = false;
	if(kyle.other)
		kyle.other.interact = false;
	kyle.other = null;
	kyle.interact = false;
	story.dialogue.index = 0;
	story.trigger = "none";
	story.randResp = -1;
	curText = "";
	clearText();
}




