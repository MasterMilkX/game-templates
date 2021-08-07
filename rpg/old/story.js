var story = {
	//character stats
	player : null,
	team : null,

	storyFunct : [],

	//level data
	size : 16,
	pause : false,

	//mission
	//quest : "Introduction",
	quest : "None",
	storyIndex : 0,
	taskIndex : 0,
	trigger : "none",
	cutscene : false,
	scene : "demo",

	//dialogue
	dialogue : {
		text : "",
		index : 0,
		show : false,
		threshold : 0
	},

	//choice 
	choice_box : {
		options : [],
		index : 0,
		lines : [],
		show : false
	},

	//overlay screen
	overlay : {
		show : false
	},

	pseudoOther : {
		textIndex : 0,
		show : true,
		interact : true,
	},

	playerCt : 0
}


function triggerWord(word){
	if(story.quest === "Register")
		return true;
	else if(story.quest === "Demo"){
		if(word.match(/touch*/g))
			return true;
		else
			return false;
	}
	else if(story.quest === "Small Talk")
		return true;
	else
		return false;
	
}

//reset the gui and cutscene stuff within the game
function endScene(){
	story.taskIndex = 0;
	story.dialogue.show = false;
	story.dialogue.text = [""];
	story.choice_box.show = false;
	story.cutscene = false;
	story.player.other.interact = false;
	story.player.other.textIndex = 0;
	story.player.interact = false;
	story.dialogue.index = 0;
	story.trigger = "none";
}

function newDialog(dialogue){
	story.dialogue.text = dialogue;
	story.dialogue.show = true;
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

function play(){
	
}