let itemCharKey = {
	'!' : ['beer','McD Sprite', 'blue drink', 'water'],
	'%' : ['pizza', 'cheetos', 'McD Fries'],
	'*' : ['house key'],
	'?' : ['phone'],
	'$' : ['money'],
	')' : ['baseball bat', 'fake sword', 'lightsaber'],
	'(' : ['varsity jacket', 'tie']
}

//return an item color
function itemColor(i){
	//brown
	if(i == 'baseball bat' || i == 'fake sword' || i == 'house key')
		return '#B48B14';
	//white
	else if(i == 'McD Sprite' || i == 'water' || i == 'phone')
		return '#eeeeee';
	//yellow
	else if(i == 'chips')
		return '#FFDF00';
	//orange
	else if(i == 'cheetos' || i == 'pizza')
		return '#FF7200';
	//red
	else if(i == 'varsity jacket' || i == 'tie' || i == 'lightsaber')
		return '#ff0000';
	//blue
	else if(i == 'blue drink')
		return '#0000ff';
	//green
	else if(i == 'money')
		return '#00ff00';
	// ????
	else
		return '#EA00FF';
}

// ADDS AN ITEM AT RANDOM TO A LOCATION
function placeItem(i,map,exclusions=[]){
	let loc = randomHousePos(map,exclusions);

	//add normal item
	if(i != '$'){
		let item = itemCharKey[i][Math.floor(Math.random()*itemCharKey[i].length)];
		map[loc[1]][loc[0]] = i
		return {'name': item, 'symb':i, 'loc':loc};
	}else{
		map[loc[1]][loc[0]] = i;
		return {'name' : 'money', 'symb':'$', 'loc':loc, 'value':Math.floor(Math.random()*1)+19};
	}
}


// PLACES ITEMS AROUND A HOUSE
function litterHouse(map, houseType){
	let pickups = ['!','%','*'];
	let n = 1;
	if(houseType == "normal_house")
		n = Math.floor(Math.random()*3);
	else
		n = Math.floor(Math.random()*5);

	let items = [];
	let exclusions = [];
	for(let i=0;i<n;i++){
		items.push(placeItem(pickups[Math.floor(Math.random()*pickups.length)],map,exclusions));
		exclusions.push(items[i].loc);
	}
	return items;
}





