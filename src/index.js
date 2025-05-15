import './styles.css';

import { wasmFunctions } from "./loadwasm.js"
import changeFavicon from "./changeFavicon.js";

import logoR from "../assets/dvdVideoR.png";
import logoB from "../assets/dvdVideoB.png";
import logoG from "../assets/dvdVideoG.png";

import faviconR from '../assets/faviconr.png';
import faviconB from '../assets/faviconb.png';
import faviconG from '../assets/favicong.png';

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
  const logoSources = [logoR, logoB, logoG];
  const img = logoSources.map(src => {
    const image = new Image();
    image.src = src;
    return image;
  });
  for (let image of img) {
    await new Promise(resolve => {
      image.onload = resolve;
    });
  }

  const imgFav = [faviconR, faviconB, faviconG];

  imgFav.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });

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
