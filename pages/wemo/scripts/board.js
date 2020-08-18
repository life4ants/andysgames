class Board {
  constructor(a,b){
    this.buildings = []
    this.berryTrees = []
    this.fires = []
    this.start = []
    this.wemoMins = 120
    var c; 

    if (arguments.length === 1 && typeof a === "object"){//loading a game, whether default, custom or resumed
      this.import(a.board)
      c = a.cells
    }
    else if (arguments.length === 2){// creating a new game on editor
      this.cols = a
      this.rows = b
      c = []
    }
    else
      return
    cells = []
    var i = 0
    for (let x = 0; x<this.cols; x++){
      cells.push([])
      for (let y = 0; y<this.rows; y++){
        cells[x].push(new Cell(c[i++] || [] ))
      }
    }
  }

  import(obj) {
    for (const key in obj){
      this[key] = obj[key]
    }
  }

  save(){
    let c = []
    for (let i = 0; i<cells.length; i++){
      for (let j = 0; j<cells[i].length; j++){
        c.push(cells[i][j].export())
      }
    }
    localStorage["wemoBoard"] = JSON.stringify({"board": board, "cells": c})
  }

  display(){
    let edge = viewport.screenEdges()
    for (let i = edge.left; i < edge.right; i++) {
      for (let j = edge.top; j< edge.bottom; j++){
        cells[i][j].display(i,j)
      }
    }

    // if (game.mode === "edit")
    //   image(tiles.players[0], this.startX*25, this.startY*25, 25, 25, 0, 25, 25, 25)
    // else {
    //   // show cells surround the man if needed:
    //   let n = 1
    //   for (let i = -1; i <= 1; i++){
    //     for (let j = i !== 0 ? 0 : -1; j<=1; j+=2){
    //       let a = man.x+i
    //       let b = man.y+j
    //       if (a >= 0 && a < this.cols && b >= 0 && b < this.rows && !cells[a][b].revealed){
    //         this.showCell(a, b, cells[a][b], true)
    //         image(tiles["clouds"+n], a*25, b*25+topbarHeight)
    //       }
    //       n++
    //     }
    //   }
    //   this.showObjects()
    //   for (let r of this.rabbits){
    //     if (typeof r.update === "function")
    //       r.update()
    //   }
    // }
  }

  fill(){
    for (let i = 0; i < this.cols; i++){
      for (let j = 0; j< this.rows; j++){
        this.pickCell(i,j)
      }
    }
  }

  initializeObjects(){
    for (let i = 0; i < this.buildings.length; i++){
      for (let j = 0; j < this.buildings[i].items.length; j++){
        let item = this.buildings[i].items[j]
        if (typeof item === "object"){
          let container = new Backpack(item.type, item.items)
          this.buildings[i].items[j] = container
        }
      }
    }
    for (let i = 0; i < this.rabbits.length; i++){
      let rabbit = new Animal("rabbit", tiles.rabbit, {x: this.rabbits[i].x, y: this.rabbits[i].y})
      this.rabbits[i] = rabbit
    }
  }

 addRabbits(){
    let types = helpers.countTypes(board)
    let total = this.rows*this.cols
    let land = total - (types.water || 0 ) - (types.river || 0)
    for (let i = 0; i < land/600; i++){
      let pos = helpers.randomPicker(["grass", "longGrass", "sand", "veggies"])
      if (pos)
        this.rabbits.push(new Animal("rabbit", tiles.rabbit, pos))
    }
  }

  showObjects(){
    for (let i=0; i<this.berryTrees.length; i++){
      let tree = this.berryTrees[i]
      if (viewport.onScreen(tree.x, tree.y) && cells[tree.x][tree.y].revealed){
        noStroke()
        fill(128,0,128)
        ellipseMode(CORNER)
        for (let j = 0; j< tree.berries.length; j++){
          ellipse(tree.x*25+tree.berries[j].x, tree.y*25+tree.berries[j].y+topbarHeight, 5, 5)
        }
      }
    }
    for (let i=0; i<this.fires.length; i++){
      let tile = this.fires[i].value > 0 ? tiles.fire[Math.floor((frameCount%6)/2)] :
        man.fireId === i ? tiles.firepitOutlined : tiles.firepit
      image(tile, this.fires[i].x*25, this.fires[i].y*25+topbarHeight)
      if (this.fires[i].value > 0)
        this.drawProgressBar(this.fires[i].x, this.fires[i].y, this.fires[i].value, 0)
    }
    if (this.bombs){
      for (var i = this.bombs.length - 1; i >= 0; i--) {
        this.bombs[i].display()
        if (this.bombs[i].move())
          this.bombs.splice(i, 1)
      }
    }
    if (this.buildings){//PATCH: check in case it's an old game
      for (let b of this.buildings){
        image(tiles[b.type], b.x*25, b.y*25+topbarHeight)
        if (b.type === "campsite"){
          if (b.isCooking){
            image(tiles.claypot_water, b.x*25+12, (b.y+1)*25+topbarHeight, 10,10)
            this.drawBadge(b.x*25+4, b.y*25+6+topbarHeight, "C", bootstrapColors.info)
          }
          if (b.fireValue > 0){
            let tile = tiles.fire[Math.floor((frameCount%6)/2)]
            image(tile, b.x*25+5, (b.y+1)*25+topbarHeight+5, 25, 15, 0, 0, 25, 15)
            this.drawProgressBar(b.x, b.y+1, b.fireValue, 5)
          }
          this.drawBadge(b.x*25+42, b.y*25+6+topbarHeight, b.items.length, "#000")
        }
      }
    }
  }

  
  pickCell(x,y){
    let cell = cells[x][y]
    if (cell.type.substr(0,6) === "random"){
      let roll = Math.random()
      if (cell.type === "randomPit" && roll < .5){
        cell.type = "pit"
        cell.tile = "pit"
        for (let k = -1; k <=1; k++){
          for (let l = -1; l<=1; l++){
            if (abs(l+k) === 1 && helpers.withinBounds(x+k,y+l))
              cells[x+k][y+l].byPit = true
          }
        }
      }
      else if (cell.type === "randomGrass" && roll < .8){
        let a = Math.floor(Math.random()*3)+1
        cell.type = "longGrass"
        cell.tile = "longGrass"+a
      }
      else if (cell.type === "randomBerries" && roll < .7){
        cell.type = "berryTree"
        cell.tile = "berryTree"
        cell.id = this.berryTrees.length
        this.berryTrees.push({x, y, berries: []})
      }
      else if (["randomLog", "randomStick"].includes(cell.type)){
        if (roll < .5)
          cell.type = cell.type === "randomLog" ? "log" : "stick"
        else
          cell.type = cell.tile.replace(/\d+$/, "")
      }
      else if (cell.type === "randomRock"){
        let a = Math.floor(Math.random()*4)+1
        if (Math.random() < .5){
          cell.type = "rock"
          cell.quantity = a
        }
        else
          cell.type = cell.tile.replace(/\d+$/, "")
      }
      else if (cell.type === "randomTree"){
        if (roll > .6){
          cell.type = "treeThin"
          cell.tile = "treeThin"
        }
        else if (roll > .1){
          cell.type = "tree"
          cell.tile = "tree"
        }
        else {
          cell.type = "grass"
          cell.tile = "grass"
        }
      }
      else {
        cell.type = "grass"
        cell.tile = "grass"
      }
    }
  }

  revealCell(x,y,fully){
    if (fully){
      cells[x][y].revealed = 2
      this.revealCount--
    }
    else {
      cells[x][y].revealed++
      if (cells[x][y].revealed === 1)
        this.revealCount --
    }
    if (this.revealCount === 40){
      popup.setAlert("Only 40 more squares to reaveal!\nBombs are now available on the build menu to clear the rest of the world")
      options.build[options.build.findIndex((e) => e.name === "bomb")].active = true
    }
    else if (this.revealCount === 0)
      setTimeout(popup.setAlert("ROH RAH RAY! You won!!\nYou revealed the whole world in "+(floor(board.wemoMins/15)/4)+" wemo hours."), 3000)
  }

  clicker(){
    let y = Math.floor((mouseY-topbarHeight)/25)
    let x = Math.floor(mouseX/25)
    let cell = cells[x][y]
    if (cell.type === "campsite"){
      popup.grabMenu("info", cell.id)
    }
    console.log(cell)
  }

  showNight(){
    let alpha, time
    let mins = this.wemoMins%1440
    if (game.paused) {
      alpha = timer.timeOfDay === "day" ? 230 : 255
      fill(0,0,0,alpha)
      rect(0,0,width,height)
      return
    }

    switch(timer.timeOfDay){
      case "day":
        return
      case "dusk":
        time = mins-1320
        alpha = Math.floor(255-pow((60-time)*.266, 2))
        break
      case "night":
        alpha = 255
        break
      case "dawn":
        time = mins-60
        alpha = Math.round(255-pow((time+1)*.266, 2))
        break
    }

    let dark = (mins >= 1360 || mins < 80)
    man.inDark = dark

    fill(0,0,0,alpha)
    noStroke()
    beginShape()
    vertex(0,0)
    vertex(width,0)
    vertex(width,height)
    vertex(0,height)
    let fires = board.fires
    for (let f of fires){
      if (f.value > 0)
        this.cutFireCircle(f.x, f.y, f.value, dark)
    }
    for (let b of this.buildings){
      if (b.fireValue > 0)
        this.cutFireCircle(b.x, b.y+1, b.fireValue, dark)
    }
    endShape(CLOSE)
    for (let f of fires){
      if (f.value > 0)
        this.drawFireCircle(f.x,f.y,f.value,alpha)
    }
    for (let b of this.buildings){
      if (b.fireValue > 0)
        this.drawFireCircle(b.x,b.y+1,b.fireValue,alpha)
    }
    if (man.inDark && man.isSleeping)
      image(tiles.z, man.x*25, man.y*25+topbarHeight)
  }

  cutFireCircle(bx,by,value,dark){
    let size = (value/4)+3.1
    let x = bx*25+12.5
    let y = by*25+12.5+topbarHeight
    let r = size*25/2
    let arm = r*0.54666
    if (dark && man.inDark){
      let d = dist(active.x*25+12.5, active.y*25+topbarHeight+12.5, x, y)
      man.inDark = d > r-10
    }
    beginContour()
    vertex(x,y-r)
    bezierVertex(x-arm,y-r,x-r,y-arm,x-r,y)
    bezierVertex(x-r,y+arm,x-arm,y+r,x,y+r)
    bezierVertex(x+arm,y+r,x+r,y+arm,x+r,y)
    bezierVertex(x+r,y-arm,x+arm,y-r,x,y-r)
    endContour()
  }

  drawFireCircle(x,y,value,alpha){
    let size = (value/4)+3.1
    ellipseMode(CENTER)
    if (alpha < 20){
      fill(0,0,0,Math.floor(alpha/2))
      noStroke()
      ellipse(x*25+12.5,y*25+12.5+topbarHeight,size*25,size*25)
    }
    else {
      noFill()
      strokeWeight(2)
      for (let i = size*25-1; i > 1; i-=3){
        let d = alpha < 40 ? alpha-20 : (alpha-40)/(size*25)*i+20
        stroke(0,0,0,d)
        ellipse(x*25+12.5,y*25+12.5+topbarHeight,i,i)
      }
    }
  }

  

  drawProgressBar(i,j,value, Xoffset){
    fill(255)
    stroke(80)
    strokeWeight(1)
    rect(i*25+2+Xoffset,j*25+19+topbarHeight, 21, 4)
    let color = value > 12 ? "green" :
                 value > 6 ? "#e90" : "red"
    fill(color)
    noStroke()
    rect(i*25+3+Xoffset, j*25+20+topbarHeight, value, 3)
  }

  
}
