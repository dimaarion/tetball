export default class Database {

  defaultValue = {
    scores:0,
    sound:1,
    effect:1,
    record:0
  }

  db = {}

  create(){
    if(!window.localStorage.getItem("tetBall")){
      window.localStorage.setItem("tetBall",JSON.stringify(this.defaultValue))
    }
   this.db = JSON.parse(window.localStorage.getItem("tetBall"))
  }

  set(name){
    window.localStorage.setItem("tetBall_" + name,JSON.stringify(this.defaultValue))
  }
  get(name){
    if(!JSON.parse(window.localStorage.getItem("tetBall_" + name))){
      window.localStorage.setItem("tetBall_" + name,JSON.stringify(this.defaultValue))
    }
    this.db = JSON.parse(window.localStorage.getItem("tetBall_" + name))
    return this.db;
  }


  setScopes(n){
    this.defaultValue.scores = n;
    this.set('scopes')
  }

  getScopes(){
    if(this.get()){
      return this.get("scopes").scores
    }else {
      return 0;
    }

  }

  setSound(n){
    this.defaultValue.sound = n;
    this.set("sound")
  }

  getSound(){
   return  this.get("sound").sound
  }

  setEffect(n){
    this.defaultValue.effect = n;
    this.set("effect")
  }

  getEffect(){
    return  this.get("effect").effect
  }

}
