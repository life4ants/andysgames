class Cell {
  constructor(ar){
    this.L1 = GtileList[ar[0]]       || "saltwater"  //ground
    this.L2 = GtileList[ar[1]]       || null         //overlapping ground - beach, mountains, etc
    this.L3 = GtileList[ar[2]]       || null         //growing things - trees, long grass, etc
    this.L4 = GtileList[ar[3]]       || null         //piles of dropped items
    this.L5 = GtileList[ar[4]]       || null         //clouds
    this.byPit = GtileList[ar[5]]    || false
    this.quantity = GtileList[ar[6]] || 0
  }

  display(gx,gy){
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

  export(){
    function num(x){
      return GtileList.findIndex((e) => e === x )
    }

    return [num(this.L1), num(this.L2), 
            num(this.L3), num(this.L4), num(this.L5), 
            this.byPit, this.quantity]
  }

}