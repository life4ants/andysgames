let editor = {
  path: [],
  tile: "saltwater",
  tool: "brush",
  auto: false,
  layer: 'L1',

  mousePressed(){
    this.mouseAction(true)
  },

  mouseDragged(){
    this.mouseAction(false)
  },

  mouseReleased(){
    if (this.auto && this.tool === "brush")
      this.parsePath(this.tile)
  },

  mouseAction(press){ // false = dragged, true = pressed
    let x = Math.floor(mouseX/TILESIZE)
    let y = Math.floor(mouseY/TILESIZE)
    let id = x+"_"+y
    if (mouseButton === LEFT){
      if (this.auto){
        switch (this.tool){
          case "brush":
            if (press)
              this.path = [id]
            else if (!press && !this.path.includes(id)){
              this.path.push(id)
            }
            this.changeTile(x,y, "cross")
            return
          case "eraser":
            this.erase(x,y); return
          default: return
        }
      }
      else { 
        switch(this.tool){
          case "brush": 
              this.changeTile(x,y,this.tile)
            return
          case "floodFill":
            this.floodFill(x, y, cells[x][y][this.layer], this.tile)
            return
          case "eraser":
            this.erase(x,y)
            return
        }
      }
    }
    else {
      if (press){
        if (this.tool === "floodFill") {
          let T = this.layer === 'L1' ? 'saltwater' : null
          this.floodFill(x, y, cells[x][y][this.layer], T)
        }
        else
          board.clicker()
      }
    }
  },
  
  erase(x,y){
    if (this.layer === 'L1')
      this.changeTile(x,y, 'saltwater')
    else
      this.changeTile(x,y, null)
  },

  showMouse(){
    if (this.tool === "brush"){
      image(Gtiles[this.auto ? this.tile + "X" : this.tile], mouseX-15, mouseY-15, 30,30)
      rectMode(CENTER)
      stroke(0)
      strokeWeight(2)
      noFill()
      rect(mouseX,mouseY, 32, 32)
    }
    else
      image(Gtiles[this.tool], mouseX-13, mouseY-13, 26,26)
  },

  changeTile(x,y, tile){
    cells[x][y][this.layer] = tile
  },

  floodFill(x,y, tile1, tile2){
    this.changeTile(x,y,tile2)
    
    for (let i = x-1; i <= x+1; i++){
      for (let j = y-1; j <= y+1; j++){
        if (i >= 0 && i < board.cols && j >= 0 && j < board.rows && 
                  cells[i][j][this.layer] === tile1)
          this.floodFill(i,j, tile1, tile2)
      }
    }
  },

  newWorld(cols, rows){
    board = new Board(cols, rows)
    game.resize(cols, rows)
  },

  treeFill(){
    for (let i=0; i<board.cols; i++){
      for (let j =0; j<board.rows; j++){
        let l = random(6)
        let h = random(12)
        let x = i%8 + j%8
        let type = (x > l && x < h) ? "tree" :
            x < l ? "treeThin" : random(10) > 7 ? "longGrass" : "grass"
        if (cells[i][j].type === "random"){
          let tile = type === "longGrass" ? "longGrass"+floor(random(3)+1) : type
          cells[i][j] = {tile, type}
        }
      }
    }
  },

  parsePath(type){
    let tiles = type === "river" ? this.riverMaker() : this.beachMaker()
    if (tiles){
      for (let i = 0; i < this.path.length; i++){
        let ar = this.path[i].split("_")
        let x = Number(ar[0])
        let y = Number(ar[1])

        this.changeTile(x,y, type+tiles[i])
      }
    }
    this.path = []
  },

  beachMaker(){
    if (this.path.length < 2)
      return false
    let ar = []
    for (let i = 0; i < this.path.length; i++){
      let id = this.path[i].split("_")
      ar.push([Number(id[0]), Number(id[1])])
    }
    let tileNum = []
    for (let i=0; i<ar.length; i++){
      let x = ar[i][0], y = ar[i][1]
      if (i === 0){
        tileNum[i] = ar[i+1][0] < x && ar[i+1][1] <= y ? 7 :
                       ar[i+1][1] < y ? 10 :
                         ar[i+1][0] > x ? 2 : 4
      }
      else if (i === ar.length-1){
        tileNum[i] = ar[i-1][0] < x && ar[i-1][1] <= y ? 2 :
                       ar[i-1][1] < y ? 4 :
                         ar[i-1][0] > x ? 7 : 10
      }
      else if (ar[i+1][0] < x && ar[i+1][1] <= y) { //next is left
        tileNum[i] = ar[i-1][1] < y ? 6 :  //last is top
                       ar[i-1][0] > x ? 7 : //last is right
                         11 // last is below
      }
      else if (ar[i+1][1] < y) { //next is top
        tileNum[i] = ar[i-1][0] > x ? 9 : //last is right
                       ar[i-1][1] > y ? 10 : // last is below
                         12 // last is left
      }
      else if (ar[i+1][0] > x) { //next is right
        tileNum[i] = ar[i-1][1] < y ? 5 :  //last is top
                       ar[i-1][0] < x ? 2 : //last is left
                         1 // last is below
      }
      else { //next is below
        tileNum[i] = ar[i-1][1] < y ? 4 :  //last is top
                       ar[i-1][0] > x ? 8 : //last is right
                         3 // last is left
      }
    }
    return tileNum
  },

  riverMaker(){
    if (this.path.length < 2)
      return false
    let ar = []
    for (let i = 0; i < this.path.length; i++){
      let id = this.path[i].split("_")
      ar.push([Number(id[0]), Number(id[1])])
    }
    let tileNum = []
    for (let i=0; i<ar.length; i++){
      let x = ar[i][0], y = ar[i][1]
      if (i === 0)
        tileNum[i] = ar[i+1][0] === x ? 5 : 6

      else if (i === ar.length-1)
        tileNum[i] = ar[i-1][0] === x ? 5 : 6

      else if (ar[i+1][0] < x) { //next is left
        tileNum[i] = ar[i-1][1] < y ? 3 :  //last is top
                       ar[i-1][0] > x ? 6 : //last is right
                         2 // last is below
      }
      else if (ar[i+1][1] < y) { //next is top
        tileNum[i] = ar[i-1][0] > x ? 4 : //last is right
                       ar[i-1][1] > y ? 5 : // last is below
                         3 // last is left
      }
      else if (ar[i+1][0] > x) { //next is right
        tileNum[i] = ar[i-1][1] < y ? 4 :  //last is top
                       ar[i-1][0] < x ? 6 : //last is left
                         1 // last is below
      }
      else { //next is below
        tileNum[i] = ar[i-1][1] < y ? 5 :  //last is top
                       ar[i-1][0] > x ? 1 : //last is right
                         2 // last is left
      }
    }
    return tileNum
  },

  islandMaker(cols,rows){
    if (cols < 17 || rows < 17)
      return
    this.path = ["10_3"]
    let x = 11, y = 3;
    let go = true, count = 0
    let dir = "R"
    let move = "R"
    let size = 7

    while(go){
      if (x < cols-size && y < size && count < cols*2){//top left
        move = y === 1 ? (dir === "U" ? ["R"] : ["D", "R"]) :
                 y === size-1 ? (dir === "D" ? ["R"] : ["U", "R"]) : this.sanitizeDirs(["R", "U", "D"], dir)
      }
      else if (x>=cols-size && y<rows-size){//right top
        move = x === cols-2 ? (dir === "R" ? ["D"] : ["L", "D"]) :
                 x === cols-size ? (dir === "L" ? ["D"] : ["R", "D"]) : this.sanitizeDirs(["D", "L", "R"], dir)
      }
      else if (x>=size && y>=rows-size){//bottom right
        move = y === rows-size ? (dir === "U" ? ["L"] : ["D", "L"]) :
                 y === rows-2 ? (dir === "D" ? ["L"] : ["U", "L"]) : this.sanitizeDirs(["L", "U", "D"], dir)
      }
      else if (x<size && y>=size){//left bottom
        move = x === 1 ? (dir === "L" ? ["U"] : ["R", "U"]) :
                 x === size-1 ? (dir === "R" ? ["U"] : ["L", "U"]) : this.sanitizeDirs(["U", "L", "R"], dir)
      }
      else if (x < cols-size && y < size && count > cols*2){//finish up
        if (y === 3){
          if (x === 9)
            go = false
          move = ["R"]
        }
        else
          move = ["U"]
      }
      let ob = this.pickMove(x,y, move)
      x = ob.x
      y = ob.y
      dir = ob.dir
      count++
      if (count > (cols+rows)*4){
        go = false
        console.error("while loop forced to quit")
      }
    }
    this.parsePath("beach")
  },

  pickMove(x,y,dirs){
    let roll = Math.random()
    switch (dirs.length){
      case 1:
        return this.move(x,y,dirs[0])
      case 2:
        return roll > .5 ? this.move(x,y,dirs[0]) : this.move(x,y,dirs[1])
      case 3:
        return roll > .5 ? this.move(x,y,dirs[0]) : roll > .25 ? this.move(x,y,dirs[1]) : this.move(x,y,dirs[2])
    }
  },

  move(x,y, dir){
    this.path.push(x+"_"+y)
    switch (dir){
      case "U": y--; break;
      case "D": y++; break;
      case "R": x++; break;
      case "L": x--; break;
    }
    return {x,y, dir}
  },

  sanitizeDirs(dirs, lastDir){
    let d = ""
    switch (lastDir){
      case "U": d = "D"; break;
      case "D": d= "U"; break;
      case "R": d= "L"; break;
      case "L": d= "R"; break;
    }
    let i = dirs.findIndex((e) => e === d)
    if (i !== -1)
      dirs.splice(i, 1)
    return dirs
  },

  magicCircle(i,j,r,print){
    let x = r, y = 0
    for (let a = TWO_PI; a >= 0; a-=(TWO_PI/(r*10))){
      let nx = r*cos(a)
      let ny = r*sin(a)
      if (round(nx) != x || round(ny) != y)
        this.path.push(round(nx+i)+"_"+round(ny+j))
      x = round(nx)
      y = round(ny)
    }
    if (print)
      this.parsePath("beach")
    else {
      console.log(this.path)
      this.path = []
    }
  }
}