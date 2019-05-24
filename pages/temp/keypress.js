
function keyPressed(){
  delay = frameCount
  keyHandler()
}
function keyHandler(){
  if (mode == "play"){
      switch(keyCode){
      case LEFT_ARROW:
        player.move(-1, 0)
        break
      case RIGHT_ARROW:
        player.move(1, 0)
        break
      case UP_ARROW:
        player.move(0, -1)
        break
      case DOWN_ARROW:
        player.move(0, 1)
        break
    }
  }
  else if ([32,65].includes(keyCode))
    mode = "welcome"
  else if (mode == "welcome"){
      switch(keyCode){
      case LEFT_ARROW:
        back()
        break
      case RIGHT_ARROW:
        forward()
        break
    }
  }
}
