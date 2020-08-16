console.time("main")
const TILESIZE = 32
var G_offset = 55 //height of topbar except in edit mode, then 0
var loaded = false
var G_tiles = {}

async function loader(){
  G_tiles = {
    dirt:       await loadImage("wemo/img_tiles/dirt.png"),
    freshwater: await loadImage("wemo/img_tiles/freshwater.png"),
    grass:      await loadImage("wemo/img_tiles/grass.png"),
    hill1:      await loadImage("wemo/img_tiles/hill1.png"),
    hill2:      await loadImage("wemo/img_tiles/hill2.png"),
    hill3:      await loadImage("wemo/img_tiles/hill3.png"),
    hill4:      await loadImage("wemo/img_tiles/hill4.png"),
    hill5:      await loadImage("wemo/img_tiles/hill5.png"),
		//sand:       await loadImage("wemo/img_tiles/sand.png"),
    saltwater:  await loadImage("wemo/img_tiles/saltwater.png")
	}
  loaded = true
  console.timeEnd("main")
}

function setup(){
  console.timeLog("main", "setup started")
  loader()
  let cvs = createCanvas(window.innerWidth, window.innerHeight)
  cvs.parent("board")
  // $("#board").css("top", world.topOffset).css("left", world.leftOffset)
  strokeJoin(ROUND)
  // noLoop()
  frameRate(12)
}

function draw(){
  if (loaded){
    background('green')
    image(G_tiles.dirt, 200,200)
  }
  else {
    background('purple')
    text("loading song", 200,200)
  }
}