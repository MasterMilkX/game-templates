
function narrative(){

	var trigger = story.trigger;
	var storyObj = story.storyObj;
	var taskIndex = story.taskIndex;

	
	
	if(kyle.other == null){
		endScene();
	}


	///////////// NPCS ///////////////

	//talk to npc
	if(kyle.other && kyle.other.name == "AI"){

		if(trigger === "talk_AI"){
			if(taskIndex == 0){
				story.cutscene = true;
				newDialog(["NPC: Welcome to...", "The RPG template!", "What do would you like | to do?"]);
			}else if(taskIndex == 1){
				newChoice(["Uh..", "IDK", "What?"])
			}
		}else if(trigger === "> Uh.."){
			if(taskIndex == 2){
				endChoice();
				newDialog(["NPC: Great answer!"]);
			}else if(taskIndex == 3){
				endScene();
			}
		}else if(trigger === "> IDK"){
			if(taskIndex == 2){
				endChoice();
				newDialog(["NPC: Superb!", "Keep your mind open!"]);
			}else if(taskIndex == 3){
				endScene();
			}
		}else if(trigger === "> What?"){
			if(taskIndex == 2){
				endChoice();
				newDialog(["NPC: Don't worry about | it!"]);
			}else if(taskIndex == 3){
				endScene();
			}
		}
	}

	//////////   ITEMS  ///////////

	
	//non-event based items
	for(let i=0;i<items.length;i++){
		let curItem = items[i];
		if(kyle.other && kyle.other.name == curItem.name){
			if(trigger === "touch_" + curItem.name){
				story.cutscene = true;
				if(taskIndex == 0){
					newDialog(curItem.text);
				}else if(taskIndex == 1){
					endScene();
				}
			}
		}
	}
}