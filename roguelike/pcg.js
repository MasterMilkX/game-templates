//set ascii values

var floor = "."
var wall = "#";
var outside_door = "/";
var close_door = '^';
var open_door = '`';
var stairs_up = "<";
var stairs_down = ">";

let houseCharKey = {
	']' : ['fridge'],
	'}' : ['bed'],
	'+' : ['tv', 'computer'],
	'_' : ['couch']
}

let houseCharValue = {
	"fridge" : ']',
	'bed' : '}',
	'tv' : '+',
	'computer' : '+',
	'couch' : '_'
}

//makes objects
function furniture(name,x,y){
	this.name = name;
	this.x=x;
	this.y=y;
	this.txt="";
	this.c = objColor(name);
	this.interSet = assignFurnInteract(name);
}
// OBJECT INTERACTION EFFECT
function interact(prob, statFX, text){
	this.prob = prob;
	this.statFX = statFX;
	this.text = text;
}	

// GIVE ASSIGNMENT OF FURNITURE INTERACTIONS
function assignFurnInteract(name){
	let i = {}
	if(name == 'computer'){
		i[1] = [new interact(0.2, [0,0,1,0,1,0],"Learned basic physics!"),
					new interact(0.2, [0,0,0,2,0,0], "Learned how to socialize!"),
					new interact(0.2, [0,0,0,0,2,0], "Watched a TED Talk!"),
					new interact(0.4, [0,0,0,0,-1,0], "Watched meme compilations...")];
		i[2] = [new interact(1.0, [2,0,0,0,0,-2], "You smashed the computer...")];
		i['opt'] = "1) Internet  2) Smash it!";
	}else if(name == 'tv'){
		i[1] = [new interact(0.5, [0,0,0,0,-1,0], "It's just static..."),
					new interact(0.5, [0,0,0,0,1,0], "A Netflix show is on...")];
		i[2] = [new interact(0.5, [0,0,1,0,0,0], "You won Rainbow Road!"),
				new interact(0.5, [0,-1,0,0,0,0], "You drove off Rainbow Road..."),
				];
		i['opt'] = "1) Watch TV  2) Play Drunk Mario Kart";
	}else if(name == 'bed'){
		i[1] = [new interact(0.0, [0,0,0,0,0,0], "Too bad, you had a redbull...")];
		i['opt'] = "1) Sleep";
	}

	return i;
}




let boxConv = {
	'#   ' : 9589,	//only top
	' #  ' : 9591,	//only bottom
	'  # ' : 9588,	//only left
	'   #' : 9590, 	//only right
	' # #' : 9484,	//left top corner
	' ## ' : 9488,	//right top corner
	'#  #' : 9492,	//left bottom corner
	'# # ' : 9496,	//right bottom corner
	'  ##' : 9472,	//hor straight
	'##  ' : 9474,	//ver straight
	'## #' : 9500,  //t right
	'### ' : 9508,	//t left
	' ###' : 9516,	//t bottom
	'# ##' : 9524,	//t top
	'####' : 9532	//plus
}
var collidable = ['#','=',']','+', '|']
collidable.push.apply(collidable,Object.values(boxConv))


// CHECKS IF AN ELEMENT IS IN AN ARRAY
function inArr(arr, e){
	if(arr.length == 0)
		return false;
	return arr.indexOf(e) !== -1
}

// MAKES INITIAL MAP
function initMap(wRange, hRange, randomDim=false){
	return blankMap(wRange,hRange,randomDim);
}

// MAKES AN EMPTY MAP
function blankMap(wRange, hRange, randomDim=false){
	//define map size
	var w = wRange;
	var h = hRange;

	if(randomDim){
		w = (Math.floor(Math.random() * (wRange[1]-wRange[0]))+wRange[0]);
		h = (Math.floor(Math.random() * (hRange[1]-hRange[0]))+hRange[0]);
	}
	

	//console.log(w + " x " + h);

	//make map with borders and floor
	var m = []
	for(var r=0;r<h;r++){
		var l = []
		for(var c=0;c<w;c++){
			if(r == 0 || c == 0 || c == w-1 || r == h-1)
				l.push(wall)
			else
				l.push(floor);
		}
		m.push(l);
	}
	return m;
}



// RETURNS A RANDOM MAP POSITION
function randomMapPos(w,h,ox=0,oy=0){
	return [Math.floor(Math.random()*(w-1))+1, Math.floor(Math.random()*(h-1)+1)];
}

// RETURNS A RANDOM HOUSE POSITION BASED ON FLOOR TILES
function randomHousePos(map, exclusions=[],char='.'){
	//find all floor tiles
	let floor = [];
	for(let r=0;r<map.length;r++){
		for(let c=0;c<map[0].length;c++){
			if(map[r][c] == char && !inArr(exclusions,c+"-"+r)){
				floor.push([c,r]);		//save as [x,y]
			}	
		}
	}
	if(floor.length > 0)
		return floor[Math.floor(Math.random()*floor.length)];
	else
		return []
}

// MAKES A HOUSE
function makeHouseMap(houseType='random'){
	//choose a random house
	let allHouses = ['normal_house', 'random_house', 'empty_house']
	if(houseType == 'random')
		houseType = allHouses[Math.floor(Math.random()*allHouses.length)];
	
	if(houseType == 'normal_house'){
		let map = [
		['#','#','#','#','#','#','#','#'],
		['#',']','.','#','.','}','}','#'],
		['#','.','.','#','.','.','.','#'],
		['#','.','#','#','^','#','#','#'],
		['#','.','.','.','.','.','.','#'],
		['#','+','_','.','=','=','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','#','#','#','#','#','/','#']
		]
		let house_objs = [
			new furniture('fridge', 1,1),
			new furniture('bed', 5,1),
			new furniture('bed', 6,1),
			new furniture('tv', 1,5),
			new furniture('couch', 2,5),
		]
		return {'htype': houseType.replace(/_/g," "), 'map':map, 'objs':house_objs};
	}else if(houseType == 'random_house'){	//blank 8x8 map
		let map = [
		['#','#','#','#','#','#','#','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','#','#','/','/','#','#','#']
		]
		let house_objs = []

		//add random furniture
		let furn_opt = ["fridge", "bed", "tv", "computer", "couch"];

		for(let i=0;i<4;i++){
			let f = furn_opt[Math.floor(Math.random()*furn_opt.length)];
			let x = Math.floor(Math.random()*5)+1;
			let y = Math.floor(Math.random()*5)+1;
			house_objs.push(new furniture(f, x,y))	
			map[y][x] = houseCharValue[f];
		}


		return {'htype': houseType.replace(/_/g," "), 'map':map, 'objs':house_objs};
	}else{	//blank 8x8 map
		let map = [
		['#','#','#','#','#','#','#','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','.','.','.','.','.','.','#'],
		['#','#','#','/','/','#','#','#']
		]
		let house_objs = []
		return {'htype': houseType.replace(/_/g," "), 'map':map, 'objs':house_objs};
	}
}

// CENTER THE GAME SCREEN IF MAP IS TOO SMALL
function padMap(mapset, w,h){
	let map = mapset['map'];
	if(map.length >= h || map[0].length >= w){
		w = map[0].length+4;
		h = map.length+4;
	}

	w = ((w-map[0].length) % 2 == 0 ? w : w+1)
	h = ((h-map.length) % 2 == 0 ? h : h+1)
		

	let newmap = [];

	//make an empty map first
	for(let r=0;r<h;r++){
		let row = []
		for(let c=0;c<w;c++){
			row.push(" ");
		}
		newmap.push(row);
	}

	//get offset
	let ox = Math.floor((w - map[0].length)/2);
	let oy = Math.floor((h - map.length)/2);

	//add the map
	for(let r=0;r<map.length;r++){
		for(let c=0;c<map[0].length;c++){
			newmap[r+oy][c+ox] = map[r][c];
		}
	}

	//offset all of the objects as well
	let objs = mapset['objs'];
	for(let o=0;o<objs.length;o++){
		objs[o].x += ox;
		objs[o].y += oy;
	}

	return {'htype': mapset['htype'], 'map' : newmap, 'objs' : objs};
}

// CONVERTS A MAP WITH HASH CHARACTERS TO UNICODE BOX CHARACTERS
function map2Box(m){

	let m2 = [];
	for(let r=0;r<m.length;r++){
		let row = [];
		for(let c=0;c<m[0].length;c++){
			if(m[r][c] != '#')
				row.push(m[r][c]);
			else{
				//get neighbors
				let n = '';
				n += ((r > 0) && (m[r-1][c] == '#') ? '#' : ' ');
				n += ((r < m.length-1) && (m[r+1][c] == '#') ? '#' : ' ');
				n += ((c > 0) && (m[r][c-1] == '#') ? '#' : ' ');
				n += ((c < m[0].length-1) && (m[r][c+1] == '#') ? '#' : ' ');

				row.push(boxConv[n]);
			}
		}
		m2.push(row)
	}
	return m2;
}

// FIND ALL OF THE DOORS ON A GIVEN MAP
function findDoor(map){
	for(let r=0;r<map.length;r++){
		for(let c=0;c<map[0].length;c++){
			if(map[r][c] == '/'){
				return [c,r];
			}
		}
	}
}

function objColor(name){
	if(name == 'fridge')
		return '#E2E2E2';
	else if(name == 'couch')
		return '#193F8C'
	else if(name == 'tv')
		return '#BB49BE'
	else if(name == 'computer')
		return '#C8E6ED';
	else if(name == 'bed')
		return '#EDF0DC';
	else
		return '#ffffff';
}



///////   OVERWORLD FUNCTIONS   ///////
function baseOverworld(start_side=""){
	let m = blankMap([20,30], [20,30], true);
	
	
	return m
}


// ADDS BUILDINGS TO THE MAP IN OPEN AREAS
function makeBuildings(map,range=[3,10]){
	let small = [['#','#','#','#'],
				['#',' ',' ','#'],
				['#',' ',' ','#'],
				['#','/','#','#']]
	let small2 = [['#','#','#','#'],
				['#',' ',' ','#'],
				['#',' ',' ','#'],
				['#','#','/','#']]
	let large = [['#','#','#','#','#'],
				['#',' ',' ',' ','#'],
				['#',' ',' ',' ','#'],
				['#',' ',' ',' ','#'],
				['#','#','/','#','#']]

	let tiny = [['#','#','#'],
					['#',' ','#'],
					['#','|','#']]


	let all_buildings = {
		'small' : [[4,4],small],
		'small2' : [[4,4],small2],
		'large' : [[5,5],large],
		'tiny' : [[3,3], tiny]
	}

	let numBuildings = Math.floor(Math.random()*(range[1]-range[0]))+range[0];
	let buildSets = Object.keys(all_buildings);

	let doorset = [];
	for(let b=0;b<numBuildings;b++){
		let buildName = buildSets[Math.floor(Math.random()*buildSets.length)];
		let door = placeBuilding(map, all_buildings[buildName]);
		if(door.length > 0){
			doorset.push([door,buildName])
		}
	}
	return doorset;

}

// FINDS A SUITABLE LOCATION ON THE MAP FOR THE GIVEN DIMENSIONS
function placeBuilding(map, build){
	let lim = 50;
	let dim = build[0];
	let arch = build[1];

	for(let i=0;i<lim;i++){
		//get random top left corner point to place
		let x = Math.floor(Math.random()*(map[0].length-dim[0]-2))+1;
		let y = Math.floor(Math.random()*(map.length-dim[1]-2))+1;

		//check from that point on
		let badPt = false;
		for(let a=0;a<dim[0]+2;a++){
			for(let b=0;b<dim[1]+2;b++){
				if(map[y+b][x+a] != "."){
					badPt = true;
					break;
				}	
			}
			if(badPt)
				break;
		}

		//allow building to be made at location
		if(!badPt){

			arch = map2Box(arch);		//convert

			let door = [];
			for(let a=0;a<dim[0];a++){
				for(let b=0;b<dim[1];b++){
					map[y+b+1][x+a+1] = arch[b][a];
					if(arch[b][a] == '/')
						door = [x+a+1,y+b+1];
				}
			}
			return door;
		}
	}

	return [];
}

//generate the overworld map
function makeOverworld(start_side="", buildRange=[3,7]){
	let m = baseOverworld(start_side);
	let doorSet = makeBuildings(m,buildRange);
	return {'map': m, 'doors': doorSet};
}

//make overworld data object
function overworldDat(){
	this.overDir = {'north':null, 'south':null,'east':null,'west':null};		//save pointers to other overworlds
	this.houseDat = {};
	this.map = [];
	this.doors = [];
	this.index = -1;
}