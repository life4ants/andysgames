
const editbar = {
  template: `
    <div class="editbar">
      <div class="menu-buttons">
        <div class="menu" @click='exit'>Exit</div>
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
            <span @click="load">Load</span>
          </div>
        </div>
      </div>
      <div class="editbar-top">
        <div class="layer-buttons">
          <span v-for = '(lay, i) in layers' :class = "{activelayer: layer === lay}"
          class="layer-button"
          @click="() => setLayer(lay)">Layer {{i+1}}</span>
        </div>
        <div class="tilebox">
          <img v-for="pic in tools" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: tool === pic.id}" 
          @click="() => setCurrent('tool', pic.id, auto)">
        </div>
      </div>
      <div class="editbar-bottom">
        <div v-if = 'layer === "L1"' class="tilebox">
          <img v-for="pic in layer1" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: tile === pic.id}" 
          @click="() => setCurrent('tile', pic.id, pic.auto)">
        </div>
        <div v-if = 'layer === "L2"' class="tilebox">
          <img v-for="pic in layer2" :key="pic.id" :src="pic.src"
          height="25" width="25" class="tile" :class="{selected: tile === pic.id}" 
          @click="() => setCurrent('tile', pic.id, pic.auto)">
        </div>
      </div>
    </div>
    `,
  data(){
    return {
      layer1: [
        { id: "freshwater", auto: false, src: "wemo/img_tiles/freshwater.png"},
        { id: "saltwater",  auto: false, src: "wemo/img_tiles/saltwater.png"},
        { id: "dirt",       auto: false, src: "wemo/img_tiles/dirt.png"},
        { id: "grass",      auto: false, src: "wemo/img_tiles/grass.png"},
        { id: "sand",       auto: false, src: "wemo/img_tiles/sand.png"},
        { id: "bedrock",    auto: false, src: "wemo/img_tiles/bedrock.png"}
      ],
      layer2: [
        { id: "grass",   auto: true,  src: "wemo/img_tiles/grassX.png"},
        { id: "hill",    auto: true,  src: "wemo/img_tiles/hillX.png"},
        { id: "sand",    auto: true,  src: "wemo/img_tiles/sandX.png"},
        { id: "grass1",  auto: false, src: "wemo/img_tiles/grass1.png"},
        { id: "grass2",  auto: false, src: "wemo/img_tiles/grass2.png"},
        { id: "grass3",  auto: false, src: "wemo/img_tiles/grass3.png"},
        { id: "grass4",  auto: false, src: "wemo/img_tiles/grass4.png"},
        { id: "grass5",  auto: false, src: "wemo/img_tiles/grass5.png"},
        { id: "grass6",  auto: false, src: "wemo/img_tiles/grass6.png"},
        { id: "grass7",  auto: false, src: "wemo/img_tiles/grass7.png"},
        { id: "grass8",  auto: false, src: "wemo/img_tiles/grass8.png"},
        { id: "grass9",  auto: false, src: "wemo/img_tiles/grass9.png"},
        { id: "grass10", auto: false, src: "wemo/img_tiles/grass10.png"},
        { id: "grass11", auto: false, src: "wemo/img_tiles/grass11.png"},
        { id: "grass12", auto: false, src: "wemo/img_tiles/grass12.png"},
        { id: "sand1",   auto: false, src: "wemo/img_tiles/sand1.png"},
        { id: "sand2",   auto: false, src: "wemo/img_tiles/sand2.png"},
        { id: "sand3",   auto: false, src: "wemo/img_tiles/sand3.png"},
        { id: "sand4",   auto: false, src: "wemo/img_tiles/sand4.png"},
        { id: "sand5",   auto: false, src: "wemo/img_tiles/sand5.png"},
        { id: "sand6",   auto: false, src: "wemo/img_tiles/sand6.png"},
        { id: "sand7",   auto: false, src: "wemo/img_tiles/sand7.png"},
        { id: "sand8",   auto: false, src: "wemo/img_tiles/sand8.png"},
        { id: "sand9",   auto: false, src: "wemo/img_tiles/sand9.png"},
        { id: "sand10",  auto: false, src: "wemo/img_tiles/sand10.png"},
        { id: "sand11",  auto: false, src: "wemo/img_tiles/sand11.png"},
        { id: "sand12",  auto: false, src: "wemo/img_tiles/sand12.png"},
        { id: "hill1",   auto: false, src: "wemo/img_tiles/hill1.png"},
        { id: "hill2",   auto: false, src: "wemo/img_tiles/hill2.png"},
        { id: "hill3",   auto: false, src: "wemo/img_tiles/hill3.png"},
        { id: "hill4",   auto: false, src: "wemo/img_tiles/hill4.png"},
        { id: "hill5",   auto: false, src: "wemo/img_tiles/hill5.png"},
        { id: "hill6",   auto: false, src: "wemo/img_tiles/hill6.png"},
        { id: "hill7",   auto: false, src: "wemo/img_tiles/hill7.png"},
        { id: "hill8",   auto: false, src: "wemo/img_tiles/hill8.png"},
        { id: "hill9",   auto: false, src: "wemo/img_tiles/hill9.png"},
        { id: "hill10",  auto: false, src: "wemo/img_tiles/hill10.png"},
        { id: "hill11",  auto: false, src: "wemo/img_tiles/hill11.png"},
        { id: "hill12",  auto: false, src: "wemo/img_tiles/hill12.png"},
        { id: "hill13",  auto: false, src: "wemo/img_tiles/hill13.png"},
        { id: "hill14",  auto: false, src: "wemo/img_tiles/hill14.png"},
        { id: "hill15",  auto: false, src: "wemo/img_tiles/hill15.png"},
        { id: "hill16",  auto: false, src: "wemo/img_tiles/hill16.png"},
        { id: "hill17",  auto: false, src: "wemo/img_tiles/hill17.png"},
        { id: "hill18",  auto: false, src: "wemo/img_tiles/hill18.png"},
        { id: "hill19",  auto: false, src: "wemo/img_tiles/hill19.png"},
        { id: "ramp",    auto: false, src: "wemo/img_tiles/ramp.png"},
      ],
      tools: [
        { id: "eraser",    src: "wemo/img_tiles/eraser.png"},
        { id: "floodFill", src: "wemo/img_tiles/floodFill.png"},
        { id: "brush",     src: "wemo/img_tiles/brush.png"}
      ],
      tile: "saltwater",
      tool: "brush",
      layer: 'L1',
      layers: ['L1', 'L2', 'L3', 'L4'],
      auto: false
    }
  },
  props: [
    'exit'
  ],
  methods: {
    setCurrent(obj, id, auto){
      this[obj] = editor[obj] = id
      this.auto = editor.auto = auto
      if (obj === "tile" && this.tool === "eraser") {
        this.tool = editor.tool = "brush"
      }
    },

    setLayer(id){
      this.layer = editor.layer = id
      editor.tile = this.tile = 
        id === 'L1' ? "saltwater" : 
        id === 'L2' ? "hill1" : 
                      "cross"
      this.auto, editor.auto = false
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
        editor.newWorld(cols,rows)
    },

    previewBoard(){
      board.fill()
    },

    saveBoard(){
      board.save()
    },

    island(){
      editor.newWorld(board.cols, board.rows)
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

