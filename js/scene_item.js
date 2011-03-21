/* SceneItem Class
   this is a "normal" JS class that lets us do some
   PARALLAX SIMULATION!
*/


function SceneItem(xpos, distance, height, imageUrl, speed) {
  if(typeof(xpos) == 'undefined') { xpos = window.innerWidth/2; }
  this.xpos = xpos;
  this.distance = distance;
  this.height = height;
  this.speed = speed;
  this.imageUrl = imageUrl;
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
  return this.baseHeight() + this.height;
};
