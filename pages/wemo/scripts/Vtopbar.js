// This replaces the html from the topbar, which shows the wemo logo and link to home page
const Vtopbar = new Vue({
  el: '#topbar',
  template: `
    <div class="title_bar">
      <div class="logo_box">
        <a href="/">
          <img id="logo" src="/images/logo.png">
        </a>
      </div>
      <div class="title_box cover">
        <h1 class="title">Wemo Explorer</h1>
      </div>
    </div>
    `,
  data(){
    return {
      show: false,
      
    }
  },
  methods: {
    
  }
})
