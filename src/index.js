import { wasmFunctions } from "./loadwasm.js"

render();

async function render() {

  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  //set initial heigth and width
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  window.addEventListener("load", dvdAnimate(canvas, ctx));
  window.addEventListener("resize", resizeCanvas(ctx), false);

}

function resizeCanvas(ctx) {
  //Set canvas size
  return () => {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }
}

async function dvdAnimate(canvas, ctx) {
  let img = [new Image(), new Image(), new Image()]; // Create new img element
  img[0].src = "./images/dvdVideoR.png"; // Set source path
  img[1].src = "./images/dvdVideoB.png"; // Set source path
  img[2].src = "./images/dvdVideoG.png"; // Set source path

  //load wasm functions
  let movementFunctions = await wasmFunctions();

  //Set initial position
  let x = random(0, ctx.canvas.width - img[0].width);
  let y = random(0, ctx.canvas.height - img[0].height);
  let vy = 3;
  let vx = 3;

  window.requestAnimationFrame(async function animateImage() {
    //calculate screen width and height
    let selection = 0;
    let { _get_selection, _get_canvas_size, _change_direction, _update_axis } = movementFunctions;
    let widthDimension = _get_canvas_size(ctx.canvas.width, img[selection].width);
    let heightDimension = _get_canvas_size(ctx.canvas.height, img[selection].height);

    x = _update_axis(x, vx, widthDimension);
    selection = _get_selection(selection, x, vx);
    y = await _update_axis(y, vy, heightDimension);
    selection = await _get_selection(selection, y, vy);
    vx = await _change_direction(x, vx, widthDimension);
    vy = await _change_direction(y, vy, heightDimension);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img[selection], x, y);
    window.requestAnimationFrame(animateImage);
  });
}

function drawImage(x, y, ctx, img) {
  img.addEventListener(
    "load",
    function () {
      ctx.drawImage(img, x, y);
    },
    false
  );
}

//Random function
function random(min, max) {
  return Math.random() * (max - min) + min;
}
