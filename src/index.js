import './styles.css';

import { loadWasm, getWasmInstance, isWasmLoaded } from './loadwasm.js';
import changeFavicon from "./changeFavicon.js";

import { areImagesLoaded, getImages, loadImages } from './loadImages.js';
import { areFaviconsLoaded, getFavIconSet, loadFavicons } from './loadFavIcons.js';

(async function start() {
  try {
    hideSpinner();
    await loadWasm();
    await loadFavicons();
    await loadImages();

    if (
      !areImagesLoaded() ||
      !areFaviconsLoaded() ||
      !isWasmLoaded()
    ) {
      throw error;
    }

    await render();
  } catch {
    showSpinner();
    setTimeout(() => start(), 3000)
  }
})();

function hideSpinner() {
  const spinner = document.getElementById('spinner');
  spinner.style.display = 'none';
}

function showSpinner() {
  const spinner = document.getElementById('spinner');
  spinner.style.display = 'block';
}

async function render(movementFunctions) {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  //set initial heigth and width
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  window.addEventListener("resize", resizeCanvas(ctx), false);
  dvdAnimate(canvas, ctx);
}

function resizeCanvas(ctx) {
  //Set canvas size
  return () => {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }
}

async function dvdAnimate(canvas, ctx) {
  const dvdImages = getImages();
  const favIcons = getFavIconSet();

  if (
    dvdImages.length === 0 ||
    favIcons.length === 0
  ) {
    throw error;
  }

  //Set initial position
  let x = random(0, ctx.canvas.width - dvdImages[0].width);
  let y = random(0, ctx.canvas.height - dvdImages[0].height);
  let vy = 3;
  let vx = 3;

  window.requestAnimationFrame(async function animateImage(frames = 0, prevSelection = 0) {
    //calculate screen width and height
    let { _get_selection, _get_canvas_size, _change_direction, _update_axis, _get_resize_ratio } = getWasmInstance();
    let selection = 0;

    let resizeRatio = _get_resize_ratio(dvdImages[selection].width, dvdImages[selection].height, ctx.canvas.height, ctx.canvas.width);

    let widthDimension = _get_canvas_size(ctx.canvas.width, dvdImages[selection].width * resizeRatio);
    let heightDimension = _get_canvas_size(ctx.canvas.height, dvdImages[selection].height * resizeRatio);

    x = _update_axis(x, vx, widthDimension);
    selection = _get_selection(selection, x, vx, frames);
    y = _update_axis(y, vy, heightDimension);
    selection = _get_selection(selection, y, vy, frames);
    vx = _change_direction(x, vx, widthDimension);
    vy = _change_direction(y, vy, heightDimension);

    if (prevSelection !== selection && frames < 50) {
      let temp = dvdImages[selection];
      dvdImages[selection] = dvdImages[prevSelection];
      dvdImages[prevSelection] = temp;

      temp = favIcons[selection];
      favIcons[selection] = favIcons[prevSelection];
      favIcons[prevSelection] = temp;
    }

    if (prevSelection !== selection) {
      frames = 0;
    }

    changeFavicon(favIcons[selection]);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(dvdImages[selection], x, y, dvdImages[selection].width * resizeRatio, dvdImages[selection].height * resizeRatio);
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
