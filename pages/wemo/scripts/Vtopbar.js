// This replaces the html from the topbar, which shows the wemo logo and link to home page
const topbar = {
  template: `
    <div class="topbar">
      <div class="side-buttons">
        <div class="menu">
          <span>Menu</span>
          <div class="menu-content">
            <span @click="saveBoard" title="save the current board">Save</span>
            <hr>
            <span @click="generateBoard" title="generate new board">New</span>
            <span @click="previewBoard">Preview</span>
            <hr>
            <span @click="island">Make an island</span>
            <span @click="grassAndTreeFill" title="fill board with trees and grass">Grass&Trees</span>
            <hr>
            <span @click="() => load()">Load default</span>
          </div>
        </div>
        <div class="menu" @click='exit'>Exit</div>
        <div class="menu" @click='() => load()' title="load a saved board">Load</div>
      </div>
      <div class="flex">
        <div class="tilebox">
          <img v-for="pic in layer1" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: selected === pic.id}" @click="() => setCurrent(pic.id, 'L1')">
        </div>
        <div class="tilebox">
          <img v-for="pic in layer2" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: selected === pic.id}" @click="() => setCurrent(pic.id, 'L2')">
        </div>
      </div>
    </div>
    `,
  data(){
    return {
      layer1: [
        { id: "freshwater", src: "wemo/img_tiles/freshwater.png"},
        { id: "saltwater",  src: "wemo/img_tiles/saltwater.png"},
        { id: "dirt",       src: "wemo/img_tiles/dirt.png"},
        { id: "grass",      src: "wemo/img_tiles/grass.png"},
        { id: "sand",       src: "wemo/img_tiles/sand.png"},
        { id: "bedrock",    src: "wemo/img_tiles/bedrock.png"},
        { id: "hill7",      src: "wemo/img_tiles/hill7.png"},
        { id: "hill8",      src: "wemo/img_tiles/hill8.png"},
        { id: "hill9",      src: "wemo/img_tiles/hill9.png"},
        { id: "hill10",     src: "wemo/img_tiles/hill10.png"},
        { id: "hill11",     src: "wemo/img_tiles/hill11.png"}
      ],
      layer2: [
        { id: "hill1",   src: "wemo/img_tiles/hill1.png"},
        { id: "hill2",   src: "wemo/img_tiles/hill2.png"},
        { id: "hill3",   src: "wemo/img_tiles/hill3.png"},
        { id: "hill4",   src: "wemo/img_tiles/hill4.png"},
        { id: "hill5",   src: "wemo/img_tiles/hill5.png"},
        { id: "hill6",   src: "wemo/img_tiles/hill6.png"},
        { id: "hill12",  src: "wemo/img_tiles/hill12.png"},
        { id: "hill13",  src: "wemo/img_tiles/hill13.png"},
        { id: "hill14",  src: "wemo/img_tiles/hill14.png"},
        { id: "hill15",  src: "wemo/img_tiles/hill15.png"}
      ],
      selected: "saltwater"
    }
  },
  props: [
    'exit'
  ],
  methods: {
    setCurrent(id, layer){
      this.selected = id
      editor.tile = id
      editor.layer = layer
    },
    generateBoard(){
      let wcols = Math.floor((window.innerWidth-37)/25)
      let wrows = Math.floor((window.innerHeight-55)/25)
      let p = prompt("How big would you like your world to be?\nSize of screen is "+wcols+" by "+wrows+". Max suggested size is 80 by 50.\n"+
        "Please enter width and height separated by a coma:")
      if (p === null)
        return
      p = p.split(",")
      let cols = Number(p[0])
      let rows = Number(p[1])
      if (cols != cols || rows != rows)
        alert("Please enter 2 numbers separated by a coma (\",\")")
      else
        editor.newWorld(cols,rows, "random")
    },

    previewBoard(){
      board.fill()
    },

    saveBoard(){
      board.save()
    },

    island(){
      editor.newWorld(board.cols, board.rows, "water")
      editor.islandMaker(board.cols, board.rows)
      editor.floodFill(8,8,cells[8][8].tile,cells[8][8].type,"random","random")
    },

    load(){
      let b = localStorage.wemoBoard
      if (b){
        board = new Board(JSON.parse(b))
        game.resize(board.cols, board.rows)
      }
    },

    grassAndTreeFill(){
      editor.treeFill()
    }
  }
}

