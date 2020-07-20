/**
 * ========================
 * INIT
 * ========================
 */
let vw, vh;
const currentURL =
  location.protocol +
  "//" +
  location.hostname +
  (location.port ? ":" + location.port : "");
const apiURL = `${currentURL}/api/v1/`;

/**
 * Initialize on page load and page resize
 */
document.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", init);

function init() {
  setViewportDimensions();
  aspectRatioSIA();
}

/**
 * Populate vw and vh variables
 */
function setViewportDimensions() {
  vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );
  vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
}

/**
 * ========================
 * SIA - SETUP
 * ========================
 */
let hSIA, wSIA, arSIA;
let spaceSIA = 200; //min space around the image width or height wise
const siaContainer = document.querySelector("#sia-container");
const siaWrapper = document.querySelector("#sia-wrapper");
const siaCanvas = document.querySelector("#sia-canvas");

let canvas = new fabric.Canvas(siaCanvas, {});

/**
 * Image aspect ratio
 */
function aspectRatioSIA() {
  console.log(siaCanvas.dataset);
  const imgW = siaCanvas.dataset.imgwidth;
  const imgH = siaCanvas.dataset.imgheight;
  arSIA = imgW / imgH; //aspect ratio is width / height
  calcSIASize();
}
/**
 * Calculate SIA Area size
 */
function calcSIASize() {
  if (vw <= vh) {
    wSIA = vw - spaceSIA;
    hSIA = wSIA / arSIA;
  } else {
    hSIA = vh - spaceSIA;
    wSIA = hSIA * arSIA;
  }
  resizeSIA();
}

/**
 * Resize SIA-Container
 */
function resizeSIA() {
  //Container
  siaContainer.style.width = `${wSIA}px`;
  siaContainer.style.height = `${hSIA}px`;
  //Wrapper
  siaWrapper.style.width = `${wSIA}px`;
  siaWrapper.style.height = `${hSIA}px`;
  //Canvas
  canvas.setDimensions({ width: wSIA, height: hSIA });
}

// canvas.setBackgroundImage(
//   ,
//   canvas.renderAll.bind(canvas),
//   {
//     // Needed to position backgroundImage at 0/0
//     originX: "left",
//     originY: "top",
//     img.scaleToWidth(canvas.width);
//     img.scaleToHeight(canvas.height);
//     width: wSIA,
//     height: hSIA
//   }
// );

canvas.setBackgroundImage(currentURL + siaCanvas.dataset.imgsrc, function() {
  let img = canvas.backgroundImage;
  img.originX = "left";
  img.originY = "top";
  img.scaleX = canvas.getWidth() / img.width;
  img.scaleY = canvas.getHeight() / img.height;
  canvas.renderAll();
});

/**
 * ========================
 * SIA - ANNOTATION
 * ========================
 */

const annoProps = {
  fill: "rgba(31,242,210,0.2)",
  transparentCorners: false,
  padding: parseFloat(0),
  hasBorders: false,
  strokeWidth: 2,
  stroke: "rgba(31,242,210,0.8)",
  borderColor: "red",
  cornerColor: "red",
  selectable: false
};

// TEST DRAW RECTANGLE
let canvasDraw = true;

let rectangle, isDown, origX, origY;

function initRectangle(o) {
  var pointer = canvas.getPointer(o.e);

  isDown = true;
  origX = pointer.x;
  origY = pointer.y;

  rectangle = new fabric.Rect({
    ...annoProps,
    left: origX,
    top: origY
  });
  canvas.add(rectangle);
}

function drawRectangle(o) {
  if (!isDown) return;
  var pointer = canvas.getPointer(o.e);
  if (origX > pointer.x) {
    rectangle.set({ left: Math.abs(pointer.x) });
  }
  if (origY > pointer.y) {
    rectangle.set({ top: Math.abs(pointer.y) });
  }

  rectangle.set({ width: Math.abs(origX - pointer.x) });
  rectangle.set({ height: Math.abs(origY - pointer.y) });
  canvas.renderAll();
}

function finishRectangle(o) {
  isDown = false;
  canvas.remove(rectangle);
  canvas.add(rectangle);
}

document.querySelector("#selection").addEventListener("click", () => {
  canvasDraw = false;
  toggleDrawing();
});

document.querySelector("#rectangle").addEventListener("click", () => {
  canvasDraw = true;
  toggleDrawing();
});

function toggleDrawing() {
  let objects = canvas.getObjects(); //return Array<objects>
  if (canvasDraw) {
    canvas.on("mouse:down", initRectangle);
    canvas.on("mouse:move", drawRectangle);
    canvas.on("mouse:up", finishRectangle);

    objects.forEach(object => {
      object.selectable = false;
    });
  } else {
    canvas.off("mouse:down", initRectangle);
    canvas.off("mouse:move", drawRectangle);
    canvas.off("mouse:up", finishRectangle);

    objects.forEach(object => {
      object.selectable = true;
    });
  }
}

document.querySelector("#save").addEventListener("click", () => {
  let objects = canvas.getObjects();
  console.log(objects);
  objects.forEach(obj => {
    console.log(obj.getScaledWidth(), obj.getScaledHeight(), obj.left, obj.top);
    console.log("I run once");
    fetch(apiURL + "annotations/abox/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": getCookieValue("csrftoken")
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        w: obj.getScaledWidth(),
        h: obj.getScaledHeight(),
        orig_x: obj.left,
        orig_y: obj.top,
        sia: 1
      })
    })
      .then(res => res.json())
      .then(json => {
        console.log(json); // output the JSON response
      });
  });
});

/**
 * Get the value of a stored cookie
 * @param {string} a The name of the cookie to retreive
 */
function getCookieValue(a) {
  var b = document.cookie.match("(^|[^;]+)\\s*" + a + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

let draggingAllowed = false;
canvas.on("mouse:wheel", function(opt) {
  const zoomVal = 0.9;
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom *= zoomVal ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});

canvas.on("mouse:down", function(opt) {
  var evt = opt.e;
  console.log(evt.altKey);
  //make normal space event key listener and create a flag
  if (draggingAllowed) {
    this.isDragging = true;
    this.selection = false;
    this.lastPosX = evt.clientX;
    this.lastPosY = evt.clientY;
  }
});

canvas.on("mouse:move", function(opt) {
  if (this.isDragging) {
    var e = opt.e;
    var vpt = this.viewportTransform;
    vpt[4] += e.clientX - this.lastPosX;
    vpt[5] += e.clientY - this.lastPosY;
    this.requestRenderAll();
    this.lastPosX = e.clientX;
    this.lastPosY = e.clientY;
  }
});

canvas.on("mouse:up", function(opt) {
  this.isDragging = false;
  this.selection = true;
});

document.addEventListener("keydown", function(event) {
  console.log("key pressed");
  console.log(event.key);
  if (event.key == " ") {
    draggingAllowed = true;
  }
});

document.addEventListener("keyup", function(event) {
  console.log("key up");
  console.log(event.key);
  if (event.key == " ") {
    draggingAllowed = false;
  }
});
