window.itemFilterFunction = function(cur_item) {
    if(cur_item.xpos < -200){ // remove items that are going off the left side
      return false;
    } else { return true; }
  }

window.spawnSceneItems = function() {
  // make a random scene item (wohoo!)
  if (window.currentSceneItems.length < 420) {
    var rDistSqrt = 2+Math.random()*18;
    var sceneItemHeight = Math.random() > 0.9 ? (400 + Math.random()*100) : 200;
    var randomSceneItem = new SceneItem(window.innerWidth, Math.pow(rDistSqrt, 4), (sceneItemHeight));
    window.currentSceneItems.push(randomSceneItem);
  }
  if (window.currentAirItems.length < 420) {
    var rDistSqrt = 2+Math.random()*18;
    var randomAirItem = new SceneItem(window.innerWidth, Math.pow(rDistSqrt, 4),
 100);
    randomAirItem.airItem = true;
    window.currentAirItems.push(randomAirItem);
  }
  window.currentSceneItems = currentSceneItems.filter(itemFilterFunction);
  window.currentAirItems = currentAirItems.filter(itemFilterFunction);
  window.spawnTimer = setTimeout(spawnSceneItems, 250+Math.random()*200);
}

/* SceneItem Class
   this is a "normal" JS class that lets us do some
   PARALLAX SIMULATION!
*/
function SceneItem(xpos, distance, height, imageUrl, speed) {
  if(typeof(xpos) == 'undefined') { xpos = window.innerWidth/2; }
  this.xpos = xpos;
  this.distance = distance;
  if(typeof(height) == 'undefined') { height = 100; }
  this.height = height;
  this.speed = speed;
  this.imageUrl = imageUrl;
  this.airItem = false;
}

SceneItem.prototype.DISTANCE_SCALE = 50;
SceneItem.prototype.parallaxRatio = function() {
  // function from 0..1 for scaling with respect to distance
  // from observer. I.e. an object nearby is big (~1), and small if far (~0)
  return Math.sqrt( 1/ ((this.distance / this.DISTANCE_SCALE) + 1));
};

SceneItem.prototype.update = function(observer_speed) {
  this.xpos += observer_speed * this.parallaxRatio();
};

SceneItem.prototype.baseHeight = function() {
  // assume item is at ground (height=0), return lowerY coord on 
  // canvas of where the object will be placed (given assumption)
  return (1 - this.parallaxRatio())*( window.innerHeight*(.7) ) +
         this.parallaxRatio() * window.innerHeight;
  //Processing: lerp(horizonY, height, parallaxRatio())
};

SceneItem.prototype.parallaxY = function() {
  // returns top corner of where this object should be rendered
  // assuming height is set
  return this.baseHeight() - this.height * this.parallaxRatio();
};

SceneItem.prototype.draw = function (context) {
  if( this.imageUrl != null )
    this.drawSvgOnContext(context);
  else if( this.customDraw != null )
    this.customDraw(context);
  else { //placeholder box
    // context.fillStyle = "rgba(145,62,62, 0.9)";
    var parallaxedHeight = this.height * this.parallaxRatio();
    var parallaxedWidth = 200 * this.parallaxRatio();
    context.fillRect(this.xpos, 
                     this.parallaxY(),
                     parallaxedWidth,
                     parallaxedHeight);
  }
}

SceneItem.prototype.drawSvgOnContext = function (context) {
  context.drawSvg(this.imageUrl, this.xpos, this.parallaxY());
};
