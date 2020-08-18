var drawer = {
	ring(gx,gy){
    noFill()
    stroke(255,0,0)
    strokeWeight(3)
    ellipseMode(CENTER)
    let s = TILESIZE-2
    let h = TILESIZE/2
    ellipse(gx*TILESIZE+h, gy*TILESIZE+Goffset+h,s,s)
  },

  image(tile, gx, gy){
    if (tile){
      image(Gtiles[tile], gx*TILESIZE, gy*TILESIZE+Goffset)
      // catch {
      //   console.error(`can't draw tile ${tile} at ${gx}, ${gy}!`)
      //   noLoop()
      // }
    }      
  },

  badge(gx,gy,num,color){
    let x = gx*TILESIZE+6, y = gy*TILESIZE+G_offset+8
    num = num+""
    noStroke()
    fill(color)
    ellipseMode(CENTER)
    ellipse(x,y,10+(num.length*3),13)
    textAlign(CENTER, CENTER)
    fill(color === "#B4D9D9" ? 0 : 255)
    textSize(10)
    text(num,x,y)
  }	
}