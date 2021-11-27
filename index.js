var canvas,
  context,
  w,
  h,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  draw = false;
var hue;

// canvas tutorial mdn docs: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
function init() {
  canvas = document.querySelector("canvas");
  context = canvas.getContext("2d");
  h = canvas.height = window.innerHeight * 0.95;
  w = canvas.width = window.innerWidth * 0.45;
 
  
  canvas.onpointermove = handlePointerMove; // cursor is moving - (we have to draw between starting and ending points)
  canvas.onpointerdown = handlePointerDown; // mouse key is pressed - (we have to start drawing)
  canvas.onpointerup = stopDrawing; // mouse key is up - (stop drawing)
  canvas.onpointerout = stopDrawing; // cursor is outside the canvas - (stop drawing)
  document.querySelector(".clear").onclick = clearCanvas;
  context.lineWidth = 4;
  hue = 0;
}


function drawLine() 
{
  var a = prevX,
    a_ = a,
    b = prevY,
    b_ = h - b,
    c = currX,
    c_ = c,
    d = currY,
    d_ = h - d;
  
  // context.lineWidth = 4;
  var NewSize = document.getElementById('lineWidth');
  NewSize.addEventListener("change", function(){
    context.lineWidth = NewSize.value;
  }); 
  
  context.strokeStyle = getColor();
  if(document.getElementById('magicBrush').checked)
  {
      context.strokeStyle = `hsl(${hue}, 100%, 50%)`;
      hue++;
      if (hue >= 360) {
        hue = 0;
      }
  }

  context.lineCap = "round";
  context.beginPath(); // starts a new path by emptying the list of sub-paths. Call this method when you want to create a new path.

  // original point
  context.moveTo(a, b); // begins a new sub-path at the point specified by the given (x, y) coordinates
  context.lineTo(c, d); // adds a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates.

  // xreflect
  context.moveTo(a_, b_); 
  context.lineTo(c_, d_);

  // yreflect
  a_ = w - a; 
  (b_ = b), (c_ = w - c);
  d_ = d;
  context.moveTo(a_, b_);
  context.lineTo(c_, d_);

  // yreflect(xreflect)
  a_ = w - a;
  (b_ = h - b), (c_ = w - c);
  d_ = h - d;
  context.moveTo(a_, b_);
  context.lineTo(c_, d_);

  // invert
  a_ = w / 2 + h / 2 - b;
  (b_ = w / 2 + h / 2 - a), (c_ = w / 2 + h / 2 - d);
  d_ = w / 2 + h / 2 - c;
  context.moveTo(a_, b_);
  context.lineTo(c_, d_);

  // xreflect(invert)
  a_ = w / 2 + h / 2 - b;
  (b_ = h / 2 - w / 2 + a), (c_ = w / 2 + h / 2 - d);
  d_ = h / 2 - w / 2 + c;
  context.moveTo(a_, b_);
  context.lineTo(c_, d_);

  // yreflect(invert)
  a_ = w / 2 - h / 2 + b;
  (b_ = w / 2 + h / 2 - a), (c_ = w / 2 - h / 2 + d);
  d_ = w / 2 + h / 2 - c;
  context.moveTo(a_, b_);
  context.lineTo(c_, d_);

  // yrelfect(xreflect(invert))
  a_ = w / 2 - h / 2 + b;
  (b_ = h / 2 - w / 2 + a), (c_ = w / 2 - h / 2 + d);
  d_ = h / 2 - w / 2 + c;
  context.moveTo(a_, b_);
  context.lineTo(c_, d_);

  context.stroke(); // adds a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates.
  context.closePath();
}

function stopDrawing() {
  // when the pointer is not down
  draw = false;
}
// origin of co-ordinates is top left corner

// we first work out a relativeX value, which is equal to the horizontal mouse position in the viewport (e.clientX)
// minus the distance between the left edge of the canvas and left edge of the viewport (canvas.offsetLeft) —
// effectively this is equal to the distance between the canvas left edge and the mouse pointer.
// If the relative X pointer position is greater than zero and lower than the Canvas width, the pointer is within the Canvas boundaries.

function recordPointerLocation(event) {
  prevX = currX;
  prevY = currY;
  currX = event.clientX - canvas.offsetLeft;
  currY = event.clientY - canvas.offsetTop;
}

function handlePointerMove(event) {
  if (draw) {
    recordPointerLocation(event);
    drawLine();
  }
}

function handlePointerDown(e) {
  // when mouse is clicked - draw is set to true
  recordPointerLocation(e);
  draw = true;
}

function clearCanvas() {
  context.clearRect(0, 0, w, h);
}

function getColor() {
  return document.querySelector(".color").value;
}

// to download canvas
function download_image(){
  image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
  var link = document.createElement('a');
  link.download = "mandala.png";
  link.href = image;
  link.click();
}
