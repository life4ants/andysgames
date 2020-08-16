class Cell {
  constructor(type){
    this.L1 = type || "saltwater" //ground
    this.L2 = null                //overlapping ground - beach, mountains, etc
    this.L3 = null                //growing things - trees, long grass, etc
    this.L4 = null                //piles of dropped items
    this.L5 = null                //clouds
    this.byPit = false
    this.quantity = 0
  }

  show(gx,gy){
    if (this.L5 === "clouds" && game.mode === "play"){
      drawer.image("clouds", gx, gy)
      return
    }
    drawer.image(this.L1, gx, gy)
    drawer.image(this.L2, gx, gy)
    drawer.image(this.L3, gx, gy)
    if (this.L4){
      drawer.image(this.quantity > 1 ? this.L4 : this.L4.slice(0,-1), gx, gy)
      if (this.quantity > 1)
        drawer.badge(x*25+4, y*25+topbarHeight+8, cell.quantity, "#000")
    // draw piles 
    }
    if (this.byPit)
      drawer.ring(gx,gy)
  }

}