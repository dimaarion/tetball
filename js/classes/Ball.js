import Action from "./Action";
export default class Ball{
  world;
  matter;
  action = new Action();
  textureCount = 0;
  ball;
  constructor(matter,world) {
    this.world = world;
    this.matter = matter;
  }




  create(x = 600,y = 0,mx = 0,my = 0){
     this.ball = this.matter.Bodies.circle(600, 70, 10, {restitution: 0.1,label:"ball", render: {
        strokeStyle: '#ffffff',
        sprite: {
          texture: './img/ball/' + this.textureCount + '.png',
          xScale: 0.21,  // Масштаб по X
          yScale: 0.21,

        },
         layer: 0
      } });
    this.matter.Composite.add(this.world, this.ball);
    const dx = x - this.ball.position.x;
    const dy = y - this.ball.position.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const speed = 18; // Можно менять скорость
    const velocity = { x: (dx / length) * speed, y: (dy / length) * speed };
    const distance = Math.sqrt(dx * dx + dy * dy);
    const moveX = this.ball.position.x + (dx / distance) * 80;
    const moveY = this.ball.position.y + (dy / distance) * 80;
    this.matter.Body.setPosition(this.ball,{x:moveX,y:moveY})
    this.matter.Body.setVelocity(this.ball,velocity)

  }

  staticBall(){
    this.ball = this.matter.Bodies.circle(600, 70, 20, {label:"static-ball",isStatic:true, isSensor:true,render: {
        strokeStyle: '#ffffff',
        sprite: {
          texture: './img/ball/' + this.textureCount + '.png',
          xScale: 0.5,  // Масштаб по X
          yScale: 0.5
        }
      } });
    this.matter.Composite.add(this.world, this.ball);
  }


}
