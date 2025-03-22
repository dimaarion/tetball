import Action from "./Action";
export default class Gun {
  world;
  matter;
  action = new Action();
  textureCount = 0;
  body;
  constructor(matter,world) {
    this.world = world;
    this.matter = matter;
  }

  create(){
    this.body = this.matter.Bodies.circle(600, 70, 80, {label:"static-gun",isStatic:true, isSensor:true, render: {
        sprite: {
          texture: './img/gun.png',
          xScale: 0.6,  // Масштаб по X
          yScale: 0.6,

        },
        layer: 1
      } });
    this.matter.Composite.add(this.world, this.body);
  }

  rotate(x,y){

    // Вычисляем разницу координат
    const dx = x - this.body.position.x;
    const dy = y - this.body.position.y;

    // Вычисляем угол в радианах
    const angle = Math.atan2(dy, dx) - Math.PI / 2;

    // Устанавливаем угол объекту
    this.matter.Body.setAngle(this.body, angle);
  }
}



