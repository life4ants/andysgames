class Scene {
  constructor(type, img, paths, characters, prev, next){
    this.img = img
    this.paths = paths
    this.prev = prev
    this.next = next
    this.type = type
    this.characters = characters
  }
  display(){
    image(this.img, 0, 0)
  }
}

