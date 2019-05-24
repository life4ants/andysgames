let scenes = {}
let current_scene = "welcome1"
let delay = 0
let mode = "menu"

function preload(){
  scenes = {
    welcome1: new Scene("welcome1",
      loadImage("images/opening1.jpg"),
      {z: 200}, [],
      false,        "welcome2"),
    welcome2: new Scene("welcome2",
      loadImage("images/opening2.jpg"),
      {z: 200}, [],
      "welcome1",        "welcome3"),
    welcome3: new Scene("welcome3",
      loadImage("images/opening3.jpg"),
      {z: 200}, [],
      "welcome2",        "castle"),
    castle: new Scene("castle",
      loadImage("images/scene_castle.jpg"),
      {z: 200, fbx: [2]}, [],
      "welcome3",        "path"),
    path: new Scene("path",
      loadImage("images/scene_path.jpg"),
      {z: 170}, [],
      "castle",     "indians"),
    indians: new Scene("indians",
      loadImage("images/scene_indians.jpg"),
      {z: 230}, [14],
      "path",        "wiseman"),
    wiseman: new Scene("wiseman",
      loadImage("images/scene_wiseman.jpg"),
      {z: 215}, [20],
      "indians",      "mardaleX"),
    mardaleX: new Scene("mardaleX",
      loadImage("images/scene_mardaleX.jpg"),
      {z: 160}, [],
      "wiseman",      "mardale"),
    mardale: new Scene("mardale",
      loadImage("images/scene_mardale.jpg"),
      {z: 200, bz: 85, bs: 0.60, fbzx: [10, 18], az: [10,11,12], abz: [11,12], ps: 11}, [],
      "mardaleX",      "pathfork"),
    pathfork: new Scene("pathfork",
      loadImage("images/scene_pathfork.jpg"),
      {z: 165, bz: 65, bs: 0.75, fbzx: [16], az: [12,13,14,15], abz: [14,15], ps: 14}, [],
      "mardale",      "caveman"),
    caveman: new Scene("caveman",
      loadImage("images/scene_caveman.jpg"),
      {z: 175}, [],
      "pathfork",     "archer"),
    archer: new Scene("archer",
      loadImage("images/scene_archer.jpg"),
      {z: 240}, [],
      "caveman",      "canby"),
    canby: new Scene("canby",
      loadImage("images/scene_canby.jpg"),
      {z: 185, bz: 85, bs: 0.70, fbzx: [20,28], az: [29,30], abz: [26, 27], ps: 28}, [],
      "archer",       "farm"),
    farm: new Scene("farm",
      loadImage("images/scene_farm.jpg"),
      {z: 240}, [],
      "canby",        "troll"),
    troll: new Scene("troll",
      loadImage("images/scene_troll.jpg"),
      {z: 175}, [],
      "farm",         "snittlegarth"),
    snittlegarth: new Scene("snittlegarth",
      loadImage("images/scene_snittlegarth.jpg"),
      {z: 200, bz: 85, bs: 0.70, fbzx: [9,16], az: [8,9,10,11], abz: [10,11], ps: 10}, [],
      "troll",        "woodsman"),
    woodsman: new Scene("woodsman",
      loadImage("images/scene_woodcutter.jpg"),
      {z: 175}, [],
      "snittlegarth",   "woods"),
    woods: new Scene("woods",
      loadImage("images/scene_woods.jpg"),
      {z: 175}, [],
      "woodsman",     "pathfork_back"),
  }
  playerSprite = loadImage("images/player.png")
  itemSprite = loadImage("images/items.png")
}

function setup(){
  let cvs = createCanvas(960, 600)
  cvs.parent("board")
  player = new Player()
  frameRate(30)
}

function draw(){
  background(0,180,0)
  if (mode == "menu"){
    textSize(50)
    fill(0)
    textAlign(CENTER,CENTER)
    text("Press space to play", width/2, height/2)
  }
  else if (mode == "welcome"){
    scenes[current_scene].display()
    toolbox.show()
  }
  else if (mode == "play"){
    scenes[current_scene].display()
    player.show()
    toolbox.show()
    if (frameCount - delay > 9 && keyIsPressed && frameCount % 2 == 0)
      keyHandler()
  }
  else if (mode == "win"){

  }
  else if (mode == "lose"){

  }
}
