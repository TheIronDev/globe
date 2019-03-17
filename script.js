const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.offsetWidth; // Width of the scene
let height = canvas.offsetHeight; // Height of the scene

let PERSPECTIVE = width * 0.8; // The field of view of our 3D scene
let PROJECTION_CENTER_X = width / 2; // x center of the canvas
let PROJECTION_CENTER_Y = height / 2; // y center of the canvas

const resize = () => {
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  if (window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  } else {
    canvas.width = width;
    canvas.height = height;
  }
};

window.addEventListener('resize', resize);

resize();

class Dot {
  constructor() {
    this.x = (Math.random() - 0.5) * width;
    this.y = (Math.random() - 0.5) * height;
    this.z = (Math.random() - 0.5) * height;
    this.radius = 10;

    this.scaleProjected = 0;
    this.xProjected = 0;
    this.yProjected = 0;
  }
  move() {
    const rand = Math.random();
    if (rand < .15) this.x += 1;
    else if (rand < .25) this.x -= 1;
    else if (rand < .35) this.y += 1;
    else if (rand < .45) this.y -= 1;
  }
  project() {
    this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z); // distance from user
    this.xProjected = (this.x * this.scaleProjected) + PROJECTION_CENTER_X; // x position on 2d plane
    this.yProjected = (this.y * this.scaleProjected) + PROJECTION_CENTER_Y; // y pos. on 2d plane
  }
  draw() {
    this.project();
    ctx.globalAlpha = Math.abs(1 - this.z / width);

    ctx.beginPath();
    const arc = [
      this.xProjected,
      this.yProjected,
      this.radius * this.scaleProjected,
      0,
      2 * Math.PI
    ];
    ctx.arc(...arc);
    ctx.fill();
  }
}

class Animation {
  constructor() {
    this.dots = [];
    let i = 200;
    while (i--) this.dots.push(new Dot());
  }
  animate() {
    this.clear();
    this.dots.forEach(dot => {
      dot.move();
      dot.draw();
    });
    window.requestAnimationFrame(() => this.animate())
  }
  clear() {
    ctx.clearRect(0, 0, width, height);
  }
  start() {
    this.animate();
  }
}

const animation = new Animation();
animation.start();
