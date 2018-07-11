let canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

let seed = Math.floor(Math.random() * 10000);
console.log('seed:', seed);
let m = new Map(50, seed);
let r = new Renderer(canvas);
r.renderMap(m);