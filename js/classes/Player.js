import Database from "./Database";
export default class Player {
  database = new Database()
  player = {}
  data = {scores:0,sound: 1,effect:1}
  count = 0;

  create(){
      if(window.ysdk){
        this.initPlayer().then((res)=>{
            res.getData().then((d)=>{
              document.querySelector("#scores").textContent = d.scores;
              console.log(d)
            });
            console.log(res.getName())
            res.getIDsPerGame().then((id)=>{
              console.log(id)
            })
        })

      }

  }

  initPlayer() {
    return window.ysdk.getPlayer().then(_player => {
      this.player = _player;
      return this.player;
    });
  }


}
