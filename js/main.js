let canvas = document.getElementById('canvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

let seed = Math.floor(Math.random() * 10000);
console.log('seed:', seed);
let map = new Map(1000, seed);
let renderer = new CanvasRenderer(canvas);

let mouse = new MouseHandler(document);

let x0 = 0;
let y0 = 0;
let scale = 1;

mouse.onDrag(null,
             function(dx, dy)
             {
               renderer.renderMap(map, x0 + dx, y0 + dy, scale);
             },
             function(dx, dy)
             {
               x0 += dx;
               y0 += dy;
               renderer.renderMap(map, x0, y0, scale);
             });
renderer.renderMap(map, x0, y0, scale);