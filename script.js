const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.offsetWidth; // Width of the scene
let height = canvas.offsetHeight; // Height of the scene

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
