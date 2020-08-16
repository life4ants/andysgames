var drawer = {
	ring(gx,gy){
    noFill()
    stroke(255,0,0)
    strokeWeight(3)
    ellipseMode(CENTER)
    let s = TILESIZE-2
    let h = TILESIZE/2
    ellipse(gx*TILESIZE+h, gy*TILESIZE+G_offset+h,s,s)
  },

  image(tile, gx, gy){
    if (tile){
      try {image(G_tiles[tile], gx*TILESIZE, gy*TILESIZE+G_offset)}
      catch {console.error(`can't draw tile ${tile} at ${gx}, ${gy}!`)}
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