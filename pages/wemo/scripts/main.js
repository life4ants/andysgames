console.timeLog("main", "loading main")
const TILESIZE = 32
var Goffset = 55 //height of topbar except in edit mode, then 0\
var GtileList = [
  null,
  "bedrock", 
  "dirt", 
  "freshwater", 
  "grass",
  "hill1", 
  "hill2", 
  "hill3",
  "hill4", 
  "hill5", 
  "hill6",
  "hill7", 
  "hill8", 
  "hill9",
  "hill10", 
  "hill11", 
  "hill12",
  "hill13", 
  "hill14", 
  "hill15",
  "saltwater", 
  "sand"      
  ]
var Gsounds = {
  "chop":    null, "eat":     null, "dig":      null,
  "pit":     null, "sleep":   null, "vomit":    null,
  "walk1":   null, "walk2":   null
}
var Gtiles = {}
var cells = []

async function loader(){
  var c = 1
  for (let i = 1; i<GtileList.length; i++){
    Gtiles[GtileList[i]] = await loadImage(`wemo/img_tiles/${GtileList[i]}.png`)
    // console.timeLog("main", c++)
	}
  for (const i in Gsounds){
    Gsounds[i] = await new Audio(`wemo/sounds/${i}.mp3`)
    // console.timeLog("main", c++)
  }
  resizeCanvas(500,500)
  Gcanvas.parent("board")
  console.timeEnd("main")
  game.mode = "welcome"
}

function setup(){
  console.timeLog("main", "setup started")
  loader()
  Gcanvas = createCanvas(200,30)
  Gcanvas.parent("loading")
  // $("#board").css("top", world.topOffset).css("left", world.leftOffset)
  strokeJoin(ROUND)
  // noLoop()
  frameRate(12)
}

function draw(){
  if (game.mode === "loading"){
    background('purple')
    text("loading song", 10,10)
  }
  else if (game.mode === "welcome"){
    background("green")
    text("ready to play!", 50,10)
  }
  else if (game.mode === "edit") {
    background('green')
    board.display()
  }
}

$("#board").contextmenu(function(e) {
    e.preventDefault();
    e.stopPropagation();
});