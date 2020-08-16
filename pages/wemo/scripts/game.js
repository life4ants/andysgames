var game = new Vue({
  el: '#game',
  template: `
    <div id="foo">
      <div v-if="mode === 'play' && isMobile">
        <div class="rightButton" @click="() => moveAction(0)"></div>
        <div class="leftButton" @click="() => moveAction(1)"></div>
        <div class="upButton" @click="() => moveAction(2)"></div>
        <div class="downButton" @click="() => moveAction(3)"></div>
      </div>
      <welcome-menu v-if="mode === 'welcome'" :startGame="startGame"
        :player="currentPlayer" :edit="edit"></welcome-menu>
      <edit-bar v-else-if="mode === 'edit'" :exit="exit"></edit-bar>
      <div v-else-if="mode === 'loading'"></div>
      <div v-else-if="mode === 'play'" class="sidebar">
        <div class="sidebar-content">
          <i class="fa fa-sign-out fa-flip-horizontal fa-2x" aria-hidden="true" @click="exit" title="Exit Game"></i>
          <i :class="{fa: true, 'fa-2x': true, 'fa-play': paused, 'fa-pause': !paused}"
                        aria-hidden="true" @click="pauseGame" :title="paused ? 'Resume Game (Space)' : 'Pause Game (Space)'"></i>
          <img src="images/centerScreen.png" title="Center Screen (X)" height="30" width="30"
                  :class="{icon: true, selected: autoCenter}" @click="() => action('X')">
          <img v-for="icon in icons" v-show="icon.active" :key="icon.id" :src="icon.src" :title="icon.title"
                  height="30" width="30" :class="{icon: true, selected: icon.selected}" @click="() => action(icon.code)">
          <i class="fa fa-info-circle fa-2x" aria-hidden="true" @click="() => infoShown = !infoShown" title="Show Info"></i>
        </div>
      </div>
      <div v-else class="sidebar" style="width: 150px">
        <div class="sidebar-content">
          <h5 style="text-decoration: underline">Build Mode</h5>
          <h6>Rules:</h6>
          <ul>
            <li>You may only build within the grey circle around your player.</li>
            <li>You may not build on the same square as your player.</li>
            <li>You may not build on an unrevealed square.</li>
            <li>A red square means you can't build at that spot, a green circle inside a square means you can.</li>
            <li>Click to build!</li>
          </ul>
          <p style="margin-left: 5px">
            You are building: <br><b>{{buildType}}</b>
          </p>
          <button style="margin-left: 20px" @click="toggleBuildMode" id="esc">Cancel</button>
        </div>
      </div>
    </div>
    `,
  components: {
    'welcome-menu': welcome,
    'edit-bar': editBar
  },
  data: {
    icons: [
      {code: "B", active: false, selected: false, id: "build", src: "images/build.png", title: "Build (B)"},
      {code: "D", active: false, selected: false, id: "dump", src: "images/dump.png", title: "Dump (D)"},
      {code: "G", active: false, selected: false, id: "grab", src: "images/grab.png", title: "Grab/Gather (G)"},
      {code: "F", active: false, selected: false, id: "feedFire", src: "images/feedFire.png", title: "Feed Fire (F)"},
      {code: "E", active: false, selected: false, id: "eat", src: "images/eat.png", title: "Eat (E)"},
      {code: "J", active: false, selected: false, id: "jump", src: "images/jump.png", title: "Jump in or out of Canoe (J)"},
      {code: "C", active: false, selected: false, id: "chop", src: "images/chop.png", title: "Chop down Tree (C)"},
      {code: "G", active: false, selected: false, id: "pick", src: "images/pick.png", title: "Gather Berries (G)"},
      {code: "F", active: false, selected: false, id: "fling", src: "images/fling.png", title: "Fling (F)"},
      {code: "S", active: false, selected: false, id: "sleep", src: "images/sleepIcon.png", title: "Go to Sleep (S)"},
      {code: "S", active: false, selected: false, id: "wake", src: "images/wakeUp.png", title: "Wake up (S)"}
    ],
    mode: "loading",
    started: false,
    paused: false,
    autoCenter: false,
    infoShown: false,
    level: 1,
    currentPlayer: {}
  },
  mounted(){
    if (!localStorage.wemoUpToDate || localStorage.wemoUpToDate !== "8pmDec122017"){
      let s = Object.keys(localStorage)
      for (let i = 0; i < s.length; i++){
        if (s[i].substr(0,8) === "wemoGame"){
          delete localStorage[s[i]]
        }
      }
      let players = JSON.parse(localStorage.wemoPlayers || "[]")
      let newPlayers = []
      for (let i=0; i<players.length; i++){
        newPlayers.push({name: players[i].name, unlockedLevel: 1, games: [], character: 0})
      }
      localStorage.setItem("wemoPlayers", JSON.stringify(newPlayers))
      localStorage.setItem("wemoUpToDate", "8pmDec122017")
    }
  },
  computed: {
    buildType(){
      if (builder.item.name){
        switch(builder.item.name){
          case "raft": return "A Raft"
          case "steppingStones": return "Stepping Stones"
          case "campsite": return "A Campsite"
        }
      }
      return ""
    },
    isMobile(){
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1)
    }
  },
  methods: {
    action(key){
      if (man.isSleeping){
        if (key === "S")
          man.goToSleep()
      }
      else {
        switch(key){
          case "B": popup.buildMenu();    break;
          case "C": actions.chop();       break;
          case "D":
            if (board.cells[active.x][active.y].type === "campsite"){ popup.dropMenu() }
            else { popup.dumpMenu() }
            break
          case "E": actions.eat();        break;
          case "F": actions.fling();      break;
          case "G":
            if (board.cells[active.x][active.y].type === "campsite"){ popup.grabMenu("grab") }
            else { actions.grab() }
            break
          case "J": man.dismount();       break;
          case "K": popup.cookMenu();     break;
          case "S": man.goToSleep();      break;
          case "T": actions.throwBomb();  break;
          case "X": this.autoCenter = !this.autoCenter; break;
        }
      }
    },

    moveAction(dir){//responds to mobile buttons for moving
      console.log(dir)
      if (!world.noKeys && !this.paused && !man.isAnimated){
        switch(dir){
          case 0: active.move(1,0);  break;
          case 1: active.move(-1,0); break;
          case 2: active.move(0,-1); break;
          case 3: active.move(0, 1); break;
        }
      }
    },

    checkActive(){
      if (man.isSleeping || this.paused || man.isAnimated){
        for (let i = 0; i<this.icons.length; i++){
          this.icons[i].active = false
        }
        this.icons[10].active = man.isSleeping
      }
      else {
        let cell = board.cells[man.x][man.y]
        //build:
        this.icons[0].active = active === man
        //dump:
        this.icons[1].active = (backpack.weight > 0 && (dumpable.includes(cell.type) || grabable.includes(cell.type))) ||
              (cell.type === "campsite" && toolbelt.getAllItems().length > 0)
        //grab:
        this.icons[2].active = (backpack.weight < backpack.maxWeight && grabable.includes(cell.type)) || cell.type === "campsite"
        //feed fire:
        this.icons[3].active = backpack.includesItems(["log", "stick", "longGrass"]).length > 0 &&
              (man.isNextToFire || cell.type === "campsite")
        //eat:
        let basket = toolbelt.getContainer("basket")
        this.icons[4].active = (("berryTree" === cell.type && board.berryTrees[cell.id].berries.length > 0)) ||
              (basket && cell.type !== "berryTree" && basket.includesItems(["berries", "veggies"]).length > 0 )
        //jump:
        this.icons[5].active = (man.isRiding && (active.landed || active.isBeside("dock") ||
              "river" === board.cells[active.x][active.y].type)) ||  (!man.isRiding && vehicles.canMount(man.x, man.y))
        //chop:
        this.icons[6].active = ["tree", "treeShore", "treeThin"].includes(cell.type)
        //pick:
        this.icons[7].active = (toolbelt.getContainer("basket") && "berryTree" === cell.type &&
              board.berryTrees[cell.id].berries.length > 0)
        //fling:
        this.icons[8].active = !!helpers.nearbyType(active.x, active.y, "construction")
        //sleep:
        this.icons[9].active = (man.canSleep && !man.isSleeping && !man.isRiding)
        //wake up:
        this.icons[10].active = man.isSleeping
      }
    },

    exit() {
      if (this.mode === "play" && !board.gameOver)
        this.saveGame()
      else if (board.gameOver){
        let index = this.currentPlayer.games.findIndex((e) => e.name === board.name)
        if (index !== -1){
          let gameId = this.currentPlayer.games[index].id
          localStorage.removeItem("wemoGame"+gameId)
          this.currentPlayer.games.splice(index,1)
          let p = JSON.parse(localStorage.wemoPlayers)
          p[this.currentPlayer.index] = this.currentPlayer
          localStorage.setItem("wemoPlayers", JSON.stringify(p))
        }
      }
      this.mode = "welcome"
      $("body").removeClass("full-screen")
      noLoop()
      this.started = false
      this.paused = false
      sounds.files['sleep'].pause()
      popup.show = false
      world.topOffset = 0
      $("#board").css("top", world.topOffset+"px").css("left", world.leftOffset)
      $(window).scrollTop(0).scrollLeft(0)
      redraw()
    },

    edit(player){
      world.topOffset = 100
      $("#board").css("top", world.topOffset+"px").css("left", "0px")
      let cols = min(floor(window.innerWidth/25), 40)
      let rows = min(floor(window.innerHeight/25), 25)
      editor.newWorld(cols, rows, "random")
      this.currentPlayer = player
      this.mode = "edit"
      this.started = true
      loop()
    },

    startGame(type, player, index){
      let b
      switch(type){
        case "default":
          b = JSON.parse(JSON.stringify(gameBoards[index-1]))
          break
        case "resume":
          b = JSON.parse(localStorage["wemoGame"+index])
          break
        case "custom":
          b = JSON.parse(localStorage["board"+index])
          b.name = index
          b.level = board.level || 10
          b.type = "custom"
      }
      man = new Man(player.character, b.startX, b.startY)
      if (man.isSleeping)
        sounds.files['sleep'].play()
      backpack = new Backpack("backpack", b.backpack)
      delete b.backpack
      toolbelt = new Toolbelt(b.toolbelt)
      delete b.toolbelt
      if (b.man){
        //patch to delete old stuff:
        delete b.man.tools
        delete b.man.basket
        //end patch
        man.import(b.man)
        delete b.man
      }
      vehicles = new Vehicle(b.vehicles)
      delete b.vehicles
      active = man.ridingId ? vehicles[man.ridingId] : man
      board = new Board(b)
      world.leftOffset = 37
      topbar.health = man.health
      topbar.energy = man.energy
      world.noKeys = false
      timer.setTime(board.wemoMins)
      if (!board.progress){
        board.fill()
        board.addRabbits()
      }
      options.reset()
      $(window).scrollTop(0).scrollLeft(0)
      $("body").addClass("full-screen")
      this.currentPlayer = player
      this.mode = "play"
      this.started = true
      this.autoCenter = false
      this.infoShown = false
      world.resize(board.cols, board.rows)
      viewport.update(true)
      frameRate(world.frameRate)
      loop()
    },

    saveGame(){
      let index1 = this.currentPlayer.games.findIndex((e) => e.name === board.name)
      let gameId = 0
      if (index1 === -1){
        let games = Object.keys(localStorage)
        for (let i = 0; i < games.length; i++){
          if (games[i].substr(0, 8) === "wemoGame"){
            let n = Number(games[i].substring(8, games[i].length))+1
            gameId = n > gameId ? n : gameId
          }
        }
        this.currentPlayer.games.push({level: board.level, id: gameId, name: board.name, type: board.type})
        let p = JSON.parse(localStorage.wemoPlayers)
        p[this.currentPlayer.index] = this.currentPlayer
        localStorage.setItem("wemoPlayers", JSON.stringify(p))
      }
      else
        gameId = this.currentPlayer.games[index1].id

      board.progress = true
      localStorage.setItem("wemoGame"+gameId, JSON.stringify(
        Object.assign({man: man.export(), vehicles: vehicles.save(),
                        backpack: backpack.items,
                        toolbelt: toolbelt.getAllItems(),
                      }, board.export())
      ))
    },

    pauseGame(){
      if (this.mode === "play"){
        if (this.paused){
          timer.resume()
          this.paused = false
          if (man.isSleeping)
            sounds.files['sleep'].play()
          popup.close()
        }
        else {
          popup.type = "gamePaused"
          popup.size = "popup-tiny"
          popup.show = true
          this.paused = true
          sounds.files['sleep'].pause()
          noLoop()
        }
      }
    },

    toggleBuildMode(){
      if (this.mode === "build"){
        this.mode = "play"
        world.leftOffset = 37
      }
      else if (this.mode === "play"){
        this.mode = "build"
        world.leftOffset = 152
      }
      viewport.update(true)
    }
  }
})
