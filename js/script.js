/* Author: 

*/
(function(window, document, undefined){

  var container, canvas, 
  SCREEN_WIDTH = window.innerWidth,
  SCREEN_HEIGHT = window.innerHeight,
  X_AXIS = 0,
  Y_AXIS = 1,
  TARGET_FPS = 30,
  horizonY = window.innerHeight * (.7),
  context,
  offsetTime = 0.0,
  memoTime = 0.0;

window.landscape = function() {
  /* setup the landscape canvas, etc */
  container = document.createElement('div');
  document.body.appendChild(container);
  canvas = document.createElement("canvas");
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  canvas.style.cursor = "crosshair";
  container.appendChild(canvas);
  context = canvas.getContext("2d");
  /* visual setup i.e. Processing setup() */
  setupAnimation();
  /* auto-resize the canvas */
  window.addEventListener('resize', onWindowResize, false);
  onWindowResize(null);
}

function setupAnimation(){
  context.fillStyle = "rgba(145,62,62, 0.9)";
  context.fillRect(0,0,200,200);
  
  // window.landscapeIntervalID = setInterval(drawLandscape, 1000.0 / TARGET_FPS);
  window.clockIntervalID = setInterval(drawClock, 2000.0);
  window.drawLandscape();
}


window.drawLandscape = function() {
  window.drawTimer = null;
  /* Looped Function */
  clearCanvas();
  drawSky();
  drawGround();
  /* drawClock(); */
  /* aiming for 30 FPS */
  window.drawTimer = setTimeout(drawLandscape, 50);
}

function clearCanvas(){
  context.clearRect(0,0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function drawSky(){
  drawSkyGradient();
  drawSun();
}

function drawSkyGradient(){
  var backgroundGradient = context.createLinearGradient(0, 0, 0, horizonY);
  backgroundGradient.addColorStop(0, "rgb(255, 190, 0)");
  backgroundGradient.addColorStop(1, "rgb(212, 110, 38)");
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, SCREEN_WIDTH, horizonY);
}

function drawSun(){
  context.fillStyle = "rgba(255,255,170)";
  context.arc(200, 200, 30, 0, Math.PI*2, 1);
  context.fill();
}

function drawGround(){
  var earthGradient = context.createLinearGradient(0, horizonY, 0, SCREEN_HEIGHT);
  earthGradient.addColorStop(0, "rgb(82,60,51)");
  earthGradient.addColorStop(1, "rgb(56,28,17)");
  context.fillStyle = earthGradient;
  context.fillRect(0, horizonY, SCREEN_WIDTH, (SCREEN_HEIGHT-horizonY));
}

window.drawClock = function(){
  $('#clock').html( timeOfDay() );
}

function onWindowResize(){
  /* auto-resize function */
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  horizonY = window.innerHeight * (.7);
  /* make a copy */
  savecanvas = document.createElement("canvas");
  savecanvas.width = canvas.width;
  savecanvas.height = canvas.height;
  savecanvas.getContext("2d").drawImage(canvas, 0, 0);

  /* change the size */
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;

  /* draw the copy */
  context.drawImage(savecanvas, 0, 0);
}

function timeOfDay(){
  var d_now = new Date();
  var seconds_past = d_now.getHours()*3600.0+d_now.getMinutes()*60.0 + d_now.getSeconds() + d_now.getMilliseconds()/1000.0;
  return (seconds_past)/(24*3600.0);
}


}) (this, this.document); 





















