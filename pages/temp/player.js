class Player {
  constructor(){
    this.slot = 3
    this.y = scenes[current_scene].paths.z
    this.img = playerSprite
    this.index = 0
    this.dir = 2
    this.size = 1 //paths.bs
    this.pos = "base" //"back"
  }

  show(){
    let x = this.index * 129
    let y = this.dir * 190
    image(this.img, (this.slot*30)-20, this.y, (this.size*129), (this.size*190), x, y, 129, 190)
  }

  move(x, y){
    let paths = scenes[current_scene].paths
    if (y == 0){
      if (this.pos == "tween"){
        if (abs(this.y - paths.z) <=5 )
          this.pos = "base"
        else if (abs(this.y - paths.bz) <=5 )
          this.pos = "back"
        else
          return
      }
      if (current_scene == "castle" && this.slot+x == 2){
        back()
        return
      }
      if (this.pos == "base" && paths.fbx && paths.fbx.includes(this.slot+x) ||
        this.pos == "back"&& paths.fbzx && paths.fbzx.includes(this.slot+x))
        return
      this.dir = x > 0 ? 2 : 3
      this.slot = this.slot+x
      this.y = this.pos == "base" ? paths.z : paths.bz
      if (this.slot < 0){
        this.slot+=32
        back()
      }
      else if (this.slot > 31){
        this.slot -=32
        forward()
      }
    }
    else {
      if (y > 0 && ((this.pos == "tween" && this.y < paths.z) ||
              (this.pos == "back" && paths.abz && paths.abz.includes(this.slot)))){
        this.dir = 0
        this.y += 20
        this.size += 0.06
        this.pos = "tween"
        this.slot = paths.ps
      }
      else if (y < 0 && ((this.pos == "tween" && this.y > paths.bz)
           || (this.pos == "base" && paths.az && paths.az.includes(this.slot)))){
        this.dir = 1
        this.y -= 20
        this.size -= 0.06
        this.pos = "tween"
        this.slot = paths.ps
      }
      else
        return
    }
    this.index = (this.index+x+y) % 6
    if (this.index < 0)
      this.index +=6

  }
}


function back(){
  if (scenes[current_scene].type == "pathfork" && player.pos == "back")
    current_scene = "woods"
  else if (scenes[current_scene].prev)
    current_scene = scenes[current_scene].prev
  if (["welcome1", "welcome2", "welcome3"].includes(current_scene)){
    mode = "welcome"
  }
  else {
    player.y = scenes[current_scene].paths.z
    player.size = 1
    player.pos = "base"
  }
}

function forward(){
  if (scenes[current_scene].next === "pathfork_back"){
    current_scene = "pathfork"
    player.y = scenes[current_scene].paths.bz
    player.size = scenes[current_scene].paths.bs
    player.pos = "back"
  }
  else if (["welcome1", "welcome2", "welcome3"].includes(scenes[current_scene].next)){
    current_scene = scenes[current_scene].next
  }
  else {
    current_scene = scenes[current_scene].next
    player.y = scenes[current_scene].paths.z
    player.size = 1
    mode = "play"
  }
}
