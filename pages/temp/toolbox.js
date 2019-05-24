let toolbox = {
  top: 467,
  height: 133,

  show(){
    fill("#8f8")
    noStroke()
    rect(0,this.top,width, height-this.top)
    textSize(20)
    fill(0)
    let msg = scenes[current_scene].characters.includes(player.slot) ?
        "press enter to talk to character" : dialog[current_scene] ? dialog[current_scene] : " "
    textAlign(LEFT,TOP)
    text(msg, 10, this.top+5, width-20, this.height-10)
    if (msg == " ")
      printItem("letter", 500, 500)
  }

}


function printItem(item, dx, dy){
  let a, b, w, h
  switch(item){
    case "letter":
      a = 4, b = 1, w = 30, h = 45
      break
  }
  let x = a*55
  let y = b*55
  image(itemSprite, dx, dy, w, h, x, y, w, h)
}
