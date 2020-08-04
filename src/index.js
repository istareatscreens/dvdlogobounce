window.addEventListener("load", dvdAnimate());

function dvdAnimate() {
  //load canvas element
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  //Set canvas size
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  let img = new Image(); // Create new img element
  img.src = "./images/dvdVideo.png"; // Set source path

  //Set initial position
  let x = random(0, ctx.canvas.width - img.width);
  let y = random(0, ctx.canvas.height - img.height);
  let vy = 3;
  let vx = 3;

  window.requestAnimationFrame(function animateImage() {
    x += vx;
    y += vy;
    console.log("x: " + x + " y: " + y + "\nvx: " + vx + " vy: " + vy);
    if ((x >= ctx.canvas.width - img.width && vx > 0) || (x <= 0 && vx < 0)) {
      vx = -vx;
    }
    if ((y >= ctx.canvas.height - img.height && vy > 0) || (y <= 0 && vy < 0)) {
      vy = -vy;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y);
    //drawImage(x, y, ctx, img);
    window.requestAnimationFrame(animateImage);
    //drawImage(x, y, ctx, img);
    //window.requestAnimationFrame(animateImage(x, y, ctx, canvas, img));
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
