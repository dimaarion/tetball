import Matter from "matter-js"
import {Howl, Howler} from 'howler';
import Action from "./classes/Action"
import Ball from "./classes/Ball";
import Gun from "./classes/Gun";
import Database from "./classes/Database";


document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
});

const database = new Database();
database.create()
let scores = document.querySelector("#scores");
let record = document.querySelector("#record");
let scoresPause = document.querySelector("#scopes-pause");
let play = document.querySelector("#play");
let pause = document.querySelector("#pause");
let pausePanel = document.querySelector("#pause-panel");
let gameOver = document.querySelector("#game-over");
let restart = document.querySelector("#restart-btn");
let soundRange = document.querySelector("#sound-range");
let effectRange = document.querySelector("#music-range");
let start = document.querySelector("#start");
let restartPause = document.querySelector("#restart-pause-btn");
let pausePlay = document.querySelector("#pause-play");
let removeBall = document.querySelector("#remove-ball-btn");
let pauseSound = false;


scores.setAttribute("transform", "translate(" + (70 + (-parseInt(scores.textContent) / 50000000)) + ",20)")
let countBall = 30
soundRange.setAttribute("value", database.getSound())
effectRange.setAttribute("value", database.getEffect())
let soundPlayer = true


let soundGun = new Howl({
  src: ['./sound/995be4ac8e6274a.mp3'],
  volume: database.getEffect(),
});
let soundBum = new Howl({
  src: ['./sound/bum2.mp3'],
  volume: database.getEffect(),
});
let soundFon = new Howl({
  src: ['./sound/bum3.mp3'],
  volume: database.getSound(),
});

let soundUp = new Howl({
  src: ['./sound/up.mp3'],
  volume: database.getEffect(),
});


//Старт игры


start.addEventListener("mousedown", () => {
  pause.setAttribute("style", "z-index:3!important;display:none;");
  start.setAttribute("style", "display:none;");

  soundFon.play()


  window.ysdk?.features.GameplayAPI.start()
})

//
soundRange.addEventListener("change", (e) => {
  soundFon.volume(e.target.value)
  database.setSound(e.target.value)
})

effectRange.addEventListener("change", (e) => {
  soundGun.volume(e.target.value)
  soundBum.volume(e.target.value)
  soundUp.volume(e.target.value)
  database.setEffect(e.target.value)
})


function startPlay() {
  pause.style.display = "none";
  pausePanel.style.display = "none"
  pauseSound = false
  if (!soundFon.playing()) {
    soundFon.play()
  }
  play.querySelector("img").src = "img/pause-btn.svg";
  window.ysdk?.features.GameplayAPI.start()
}

play.addEventListener("mousedown", () => {

  if (pause.style.display === "none") {
    pauseSound = true
    pause.style.display = "block";
    pausePanel.style.display = "block";
    soundFon.pause();
    play.querySelector("img").src = "img/play-btn.svg";
    window.ysdk?.features.GameplayAPI.stop()

  } else {
    startPlay()
  }
})

pausePlay.addEventListener("mousedown", () => {
  startPlay()
})

// Add event listener for visibility change

document.onvisibilitychange = () => {
  if (document.visibilityState === "hidden") {
    soundFon.pause();
  } else {

    if (!soundFon.playing() && pause.style.display === "none") {
      soundFon.play()
    }

  }
}


const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Body = Matter.Body,
  Events = Matter.Events,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Bodies = Matter.Bodies;

// create an engine
const engine = Engine.create(),
  world = engine.world;

world.gravity.y = 0.1


// create a renderer
let render = Render.create({
  element: document.body,
  engine: engine,


  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: 'url("img/bg.png")',
    pixelRatio: window.devicePixelRatio, // here
    //  showAngleIndicator: false,
  }
});

// add all of the bodies to the world
const renderObject = {fillStyle: 'transparent', visible: true}
Composite.add(world, [
  // walls
  Bodies.rectangle(600, 0, 1250, 50, {isStatic: true, render: renderObject}),
  Bodies.rectangle(600, 600, 1250, 50, {isStatic: true, render: renderObject}),
  Bodies.rectangle(1200, 300, 50, 600, {isStatic: true, render: renderObject}),
  Bodies.rectangle(0, 300, 50, 600, {isStatic: true, render: renderObject})
]);

let ball = new Ball(Matter, world);
let ballStatic = new Ball(Matter, world);
let action = new Action();
let gun = new Gun(Matter, world)
ballStatic.staticBall();


let mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0,
      render: {
        visible: false
      }
    }
  });

Composite.add(world, mouseConstraint);
Events.on(mouseConstraint, 'mouseup', function (event) {
  let mousePosition = event.mouse.position;
  if (mousePosition.y > 100) {
    ballStatic.textureCount = action.getRandomInt(countBall)
    ballStatic.ball.render.sprite.texture = './img/ball/' + ballStatic.textureCount.toString() + ".png";
    soundGun.play();
  }

});

Events.on(mouseConstraint, 'mousedown', function (event) {
  let mousePosition = event.mouse.position;
  if (mousePosition.y > 100) {
    ball.textureCount = ballStatic.textureCount
    ball.create(mousePosition.x, mousePosition.y);
    gun.rotate(mousePosition.x, mousePosition.y)

  }
});
gun.create()
Events.on(mouseConstraint, 'mousemove', function (event) {
  let mousePosition = event.mouse.position;
  if (mousePosition.y > 100) {
    gun.rotate(mousePosition.x, mousePosition.y)
  }
});

Events.on(engine, 'collisionStart', (event) => {
  function enlargeBody(body) {
    // Увеличиваем тело в 1.2 раза
    if (body.circleRadius < 60) {
      Matter.Body.scale(body, 1.2, 1.2);
      if (soundPlayer) {
        soundUp.play()
      }

      // Увеличиваем текстуру
      if (body.render.sprite) {
        body.render.sprite.xScale *= 1.2;
        body.render.sprite.yScale *= 1.2;
      }
    }
  }

  event.pairs.forEach((pair) => {
    const {bodyA, bodyB} = pair;
    // Увеличиваем оба тела в 1.2 раза
    if (bodyA.label === "ball" && bodyB.label === "ball") {
      if (bodyA.render.sprite.texture !== bodyB.render.sprite.texture) {
        enlargeBody(bodyA);
        enlargeBody(bodyB);
      } else {
        if (bodyA.render.sprite.texture === bodyB.render.sprite.texture) {
          // Удаляем оба объекта из мира
          Matter.World.remove(engine.world, bodyA);
          Matter.World.remove(engine.world, bodyB);
          if (soundPlayer) {
            soundBum.play();
          }

          if (scores) {
            scores.textContent = JSON.parse(scores.textContent) + 1;

            if(parseInt(record.textContent) < parseInt(scores.textContent)){
              record.textContent = scores.textContent
              save(scores.textContent)
              setLB(scores.textContent)

            }
          }
        }
      }
    }
  });
  event.pairs.forEach((pair) => {
    const {bodyA, bodyB} = pair;
    if (bodyB.label === "ball" && bodyA.label === "static-gun") {
      pause.style.display = "block";
      gameOver.style.display = "block";
      soundPlayer = false;
      soundBum.pause();
      soundUp.pause();
      soundFon.pause();
      window.ysdk?.features.GameplayAPI.stop()
    }


  });

});

function playStart(){
  soundPlayer = true
  if (!soundFon.playing()) {
    soundFon.play()
  }
  window.ysdk?.features.GameplayAPI.start()
}

function playStop(){
  soundFon.pause();
  soundPlayer = false;
  window.ysdk?.features.GameplayAPI.stop()
}


function setRestart() {
  window.ysdk?.adv.showFullscreenAdv({
    callbacks: {
      onOpen: () => {
        playStop()
      },
      onClose: () => {
       playStart()
      },
      onError: (e) => {
        console.log('Error while open video ad:', e);
      }
    }
  })
  Composite.remove(world, world.bodies.filter((el) => el.label === "ball"));
  pause.style.display = "none";
  pausePanel.style.display = "none";
  gameOver.style.display = "none";

 if(parseInt(record.textContent) < parseInt(scores.textContent)){
   save(scores.textContent)
   setLB(scores.textContent)
   record.textContent = scores.textContent;
 }
 scores.textContent = "0"
}

// Рестарт игры
restartPause.addEventListener("mousedown", setRestart);
restart.addEventListener("mousedown", setRestart);
removeBall.addEventListener("mousedown",()=>{
  window.ysdk.adv.showRewardedVideo({
    callbacks: {
      onOpen: () => {
        playStop();
      },
      onRewarded: () => {
        Composite.remove(world, world.bodies.filter((el,i) => el.label === "ball" && i < 10));
        pause.style.display = "none";
        pausePanel.style.display = "none";
        gameOver.style.display = "none";
      },
      onClose: () => {
       playStart();

      },
      onError: (e) => {
        console.log('Error while open video ad:', e);
      }
    }
  })


})
//
render.mouse = mouse;

let handleWindowResize = function () {
  // get the current window size
  let width = window.innerWidth,
    height = window.innerHeight;

  // set the render size to equal window size
  Render.setSize(render, width, height);

  // update the render bounds to fit the scene
  Render.lookAt(render, Composite.allBodies(world), {
    x: 0,
    y: 0
  });
};


// run the renderer
Render.run(render);

// create runner
let runner = Runner.create();

// run the engine
Runner.run(runner, engine);

window.addEventListener('resize', handleWindowResize);
handleWindowResize();
