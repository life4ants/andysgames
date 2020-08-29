console.timeLog("main", "loading main")
const TILESIZE = 32
var Goffset = 0 //height of topbar except in edit mode, then 0\
var Gtiles = {}
var cells = []
var Gclick = true
var GtileList = [
  null,
  "bedrock",
  "cross",
  "dirt", 
  "eraser",
  "floodFill",
  "freshwater", 
  "grass",    "grassX",
  "grass1",   "grass2",  "grass3",  "grass4",   "grass5",   "grass6",   
  "grass7",   "grass8",  "grass9",  "grass10",  "grass11",  "grass12",
  "hillX", 
  "hill1",   "hill2",  "hill3",  "hill4",   "hill5",   "hill6",   
  "hill7",   "hill8",  "hill9",  "hill10",  "hill11",  "hill12",
  "hill13",  "hill14", "hill15", "hill16",  "hill17",  "hill18",  "hill19",
  "ramp",
  "saltwater", 
  "sand",    "sandX",
  "sand1",   "sand2",  "sand3",  "sand4",   "sand5",   "sand6",   
  "sand7",   "sand8",  "sand9",  "sand10",  "sand11",  "sand12",    
  ]
var Gsounds = {
  "chop":    null, "eat":     null, "dig":      null,
  "pit":     null, "sleep":   null, "vomit":    null,
  "walk1":   null, "walk2":   null
}

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
    if (frameCount % 4 == 0){
      background('green')
      board.display()
    }
    editor.showMouse()
  }
}

$("#board").contextmenu(function(e) {
    e.preventDefault();
    e.stopPropagation();
});