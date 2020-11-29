import { wasmFunctions } from "./loadwasm.js"

import logoR from "../public/images/dvdVideoR.png";
import logoB from "../public/images/dvdVideoB.png";
import logoG from "../public/images/dvdVideoG.png";

let resizeRatio = 2;

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
  console.log(logoR);
  img[0].src = logoR; // Set source path
  img[1].src = logoB; // Set source path
  img[2].src = logoG; // Set source path

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


    if (img[selection].height / ctx.canvas.height > 0.25 || img[selection].width / ctx.canvas.width > 0.25) {
      resizeRatio = (img[selection].height / ctx.canvas.height > img[selection].width / ctx.canvas.width) ? 1 - img[selection].height / ctx.canvas.height : 1 - img[selection].width / ctx.canvas.width;
      if (resizeRatio < 0.25) resizeRatio = 0.25;
    }

    let widthDimension = _get_canvas_size(ctx.canvas.width, img[selection].width * resizeRatio);
    let heightDimension = _get_canvas_size(ctx.canvas.height, img[selection].height * resizeRatio);

    x = _update_axis(x, vx, widthDimension);
    selection = _get_selection(selection, x, vx);
    y = await _update_axis(y, vy, heightDimension);
    selection = await _get_selection(selection, y, vy);
    vx = await _change_direction(x, vx, widthDimension);
    vy = await _change_direction(y, vy, heightDimension);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img[selection], x, y, img[selection].width * resizeRatio, img[selection].height * resizeRatio);
    window.requestAnimationFrame(animateImage);
  });
}

function drawImage(x, y, ctx, img, width, height) {
  img.addEventListener(
    "load",
    function () {
      ctx.drawImage(img, x, y, width, height);
    },
    false
  );
}

//Random function
function random(min, max) {
  return Math.random() * (max - min) + min;
}
