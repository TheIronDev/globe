const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.offsetWidth; // Width of the scene
let height = canvas.offsetHeight; // Height of the scene

let PERSPECTIVE = width * 0.8; // The field of view of our 3D scene
let PROJECTION_CENTER_X = width / 2; // x center of the canvas
let PROJECTION_CENTER_Y = height / 2; // y center of the canvas
let GLOBE_RADIUS = width / 3;

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

    this.theta = Math.random() * 2 * Math.PI; // Random value between [0, 2Pi]
    this.phi = Math.acos((Math.random() * 2) - 1); // Random value between [0, Pi]
  }
  move() {
    this.theta += .01;
  }
  project() {
    // Calculate the x, y, z coordinates in the 3D world
    this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);
    this.y = GLOBE_RADIUS * Math.cos(this.phi);
    this.z = GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta) + GLOBE_RADIUS;

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

    // Rearrange to render furthest first
    this.dots = this.dots.sort((dotA, dotB) => (dotA.z > dotB.z ? -1 : 1));
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
