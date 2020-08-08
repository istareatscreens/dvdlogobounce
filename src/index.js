//load canvas element
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
//set initial heigth and width
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

window.addEventListener("load", dvdAnimate());
window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
  //Set canvas size
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

function dvdAnimate() {
  let img = [new Image(), new Image(), new Image()]; // Create new img element
  img[0].src = "./images/dvdVideoR.png"; // Set source path
  img[1].src = "./images/dvdVideoB.png"; // Set source path
  img[2].src = "./images/dvdVideoG.png"; // Set source path

  //Set initial position
  let x = random(0, ctx.canvas.width - img[0].width);
  let y = random(0, ctx.canvas.height - img[0].height);
  let vy = 3;
  let vx = 3;

  window.requestAnimationFrame(function animateImage() {
    //calculate screen width and height
    let selection = 0;
    let width = ctx.canvas.width - img[selection].width;
    let height = ctx.canvas.height - img[selection].height;
    //Velocity
    x += vx;
    y += vy;

    //handle boundary
    if (0 > (vx = imageBoundry(x, vx, width))) selection++;
    if (0 > (vy = imageBoundry(y, vy, height))) selection++;
    if (selection > 2) selection = 0;

    //handle outside boundary
    if (x > width) x = width;
    if (y > height) y = height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img[selection], x, y);
    window.requestAnimationFrame(animateImage);
  });
}

function imageBoundry(axis, velocity, boundary) {
  return (axis >= boundary && velocity > 0) || (axis <= 0 && velocity < 0)
    ? -velocity
    : velocity;
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
