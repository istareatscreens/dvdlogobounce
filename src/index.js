import { wasmFunctions } from "./loadwasm.js"
import changeFavicon from "./changeFavicon.js";

import logoR from "../public/images/dvdVideoR.png";
import logoB from "../public/images/dvdVideoB.png";
import logoG from "../public/images/dvdVideoG.png";

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
  img[0].src = logoR; // Set source path
  img[1].src = logoB; // Set source path
  img[2].src = logoG; // Set source path

  let base_url = window.location.origin;
  let imgFav = [
    base_url + "/images/faviconr.png",
    base_url + "/images/faviconb.png",
    base_url + "/images/favicong.png"
  ]

  //load wasm functions
  let movementFunctions = await wasmFunctions();

  //Set initial position
  let x = random(0, ctx.canvas.width - img[0].width);
  let y = random(0, ctx.canvas.height - img[0].height);
  let vy = 3;
  let vx = 3;

  window.requestAnimationFrame(async function animateImage(frames = 0, prevSelection = 0) {
    //calculate screen width and height
    let { _get_selection, _get_canvas_size, _change_direction, _update_axis, _get_resize_ratio } = movementFunctions;
    let selection = 0;

    if (img[selection].height / ctx.canvas.height > 0.25 || img[selection].width / ctx.canvas.width > 0.25) {
      resizeRatio = (img[selection].height / ctx.canvas.height > img[selection].width / ctx.canvas.width) ? 1 - img[selection].height / ctx.canvas.height : 1 - img[selection].width / ctx.canvas.width;
      if (resizeRatio < 0.25) resizeRatio = 0.25;
    }

    let resizeRatio = _get_resize_ratio(img[selection].width, img[selection].height, ctx.canvas.height, ctx.canvas.width);

    let widthDimension = _get_canvas_size(ctx.canvas.width, img[selection].width * resizeRatio);
    let heightDimension = _get_canvas_size(ctx.canvas.height, img[selection].height * resizeRatio);

    x = _update_axis(x, vx, widthDimension);
    selection = _get_selection(selection, x, vx, frames);
    y = _update_axis(y, vy, heightDimension);
    selection = _get_selection(selection, y, vy, frames);
    vx = _change_direction(x, vx, widthDimension);
    vy = _change_direction(y, vy, heightDimension);

    if (prevSelection !== selection && frames < 50) {
      let temp = img[selection];
      img[selection] = img[prevSelection];
      img[prevSelection] = temp;

      temp = imgFav[selection];
      imgFav[selection] = imgFav[prevSelection];
      imgFav[prevSelection] = temp;
    }

    if (prevSelection !== selection) {
      frames = 0;
    }

    changeFavicon(imgFav[selection]);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img[selection], x, y, img[selection].width * resizeRatio, img[selection].height * resizeRatio);
    window.requestAnimationFrame(() => animateImage(frames + 1, selection));
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
