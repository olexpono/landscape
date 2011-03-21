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
  memoTime = 0.0;
  window.offsetTime = 0.0;
  var COLOR_FOR_HOUR = [ [120, 28, 58],
                         [69,21,61],
                         [37,0,70],
                         [24,0,64],
                         [110,48,149],
                         [174,129,248],
                         [25,229,169],
                         [149,209,44],
                         [48,209,23],
                         [0,255,0],
                         [0,255,255],
                         [0,182,255],
                         [0,129,255],
                         [75,81,242],
                         [229,119,255],
                         [255,92,92],
                         [255,110,38],
                         [255,131,35],
                         [255,190,0],
                         [140,125,84],
                         [89,133,110],
                         [52,78,120],
                         [37,36,120],
                         [153,61,147]];
  

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

window.drawClock = function(){
  // output internal 'timeOfDay' in HR:MN format
  $('#clock').html( parseInt(timeOfDay()*24)+ ":" + parseInt(timeOfDay()*1440)%60 );
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
  drawMoonGlow();
  drawMoon();
  drawSunGlow();
  drawSun();
}

function drawSkyGradient(){
  var backgroundGradient = context.createLinearGradient(0, 0, 0, horizonY);
  // top of the sky = sky color at the moment
  backgroundGradient.addColorStop(0, skyColorFromTime(timeOfDay()));
  // bottom of the sky = sky color ~20+ mins from now
  backgroundGradient.addColorStop(1, skyColorFromTime(timeOfDay()+ .02)); 
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, SCREEN_WIDTH, horizonY);
}

function skyColorFromTime(tod) {
  //tod is 0-1 for 24 hours
  var proportionOfHour = tod * 24 % 1;
  var previousHourColor = COLOR_FOR_HOUR[parseInt(tod*24)];
  // parse current hour, add one, with 0-23 wraparound
  var nextHourColor = COLOR_FOR_HOUR[ (parseInt(tod*24)+1)%24 ];
  return lerpColor(previousHourColor, nextHourColor, proportionOfHour);
}

function drawSunGlow(){
  var sunGlowGradient = context.createRadialGradient(sunX(), sunY(), 0, sunX()+Math.random()*2, sunY()+Math.random()*2, sunGlowRadius());
  sunGlowGradient.addColorStop(0, "rgba(255,40,0,1)");
  sunGlowGradient.addColorStop(.4, "rgba(255, 32, 0, .8)");
  sunGlowGradient.addColorStop(1, "rgba(255,40,0,0)");
  context.fillStyle = sunGlowGradient;
  context.fillRect(0, 0, SCREEN_WIDTH, horizonY);
}

function sunGlowRadius(){
  var tod = timeOfDay();
  if( (tod < .20) || (tod > .8)){
    return 50;
  }
  return Math.abs(Math.sin(tod*Math.PI*2))*220;
}

function drawSun(){
  context.fillStyle = "rgba(255,255,175, 0.95)";
  context.beginPath();
  context.arc(sunX(), sunY(), 30, 0, Math.PI*2, 1);
  context.fill();
}

function drawMoonGlow(){

}

function drawMoon(){
  context.fillStyle = "rgba(202,202,202, 0.95)";
  context.beginPath();
  context.arc(moonX(), moonY(), 30, 0, Math.PI*2, 1);
  context.fill();
}

function drawGround(){
  var earthGradient = context.createLinearGradient(0, horizonY, 0, SCREEN_HEIGHT);
  earthGradient.addColorStop(0, "rgb(82,60,51)");
  earthGradient.addColorStop(1, "rgb(56,28,17)");
  context.fillStyle = earthGradient;
  context.fillRect(0, horizonY, SCREEN_WIDTH, (SCREEN_HEIGHT-horizonY));
}

/* Processing Originals */
function sunY(){
  return SCREEN_HEIGHT*.7 + Math.sin(timeOfDay()*Math.PI*2 + Math.PI/2)*SCREEN_HEIGHT*0.6;
}
function sunX(){
  return SCREEN_WIDTH*.5 - Math.sin(timeOfDay()*Math.PI*2)*SCREEN_WIDTH*0.3;
}
function moonY(){
  return SCREEN_HEIGHT*.7 + Math.sin(timeOfDay()*Math.PI*2 - Math.PI/2)*SCREEN_HEIGHT*.6;
}
function moonX(){
  return SCREEN_WIDTH*.5 + Math.sin(timeOfDay()*Math.PI*2)*SCREEN_WIDTH*0.3;
}

window.lerpColor = function(rgb1, rgb2, proportion){
  // Linear Interpolation between two rgb colors,
  // args: [#,#,#], [#,#,#], 0-1.0 float
  // returns CSS-parseable string like "rgb(24, 56, 220)"
  var newRGB = [0, 0, 0];
  for(var i = 0; i< newRGB.length; i++){
    newRGB[i] = parseInt(rgb1[i]*(1.0-proportion) + rgb2[i]*proportion);
  }
  return "rgb(".concat(newRGB.join(",") , ")");
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
  var seconds_past = d_now.getHours()*3600.0 +
                     d_now.getMinutes()*60.0 +
                     d_now.getSeconds() +
                     d_now.getMilliseconds()/1000.0;
  return ((seconds_past)/(24*3600.0)+ window.offsetTime)%1;
}


}) (this, this.document); 





















