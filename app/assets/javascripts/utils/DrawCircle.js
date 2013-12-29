var DrawCircle = (function (Raphael){
  var init, canvas_height, canvas_width, paper, current_arc,
    destroy, adjustCanvas, angleFromPercent, degreesToRadians, drawArc, drawCircle, 
    getCanvas, $getCanvas,
    getCanvasWidth, getCanvasHeight, getPointOnCircle, getCenterOfCanvas, 
    getCenterOfRect, getRadiusOfRect, pathStringForArcOfCircle, 
    sweepFlagsFromAngle;

  // Container must be a string to the id of the container where the svg canvas is going to live
  init = function (container, canvas_width, canvas_height){ 
    canvas_width = canvas_width;
    canvas_height = canvas_height;
    paper = Raphael(container, canvas_width, canvas_height);
    return this;
  };

  adjustCanvas = function (w, h){
    canvas_width = w; canvas_height = h;
    paper.setSize(w, h);
  };

  angleFromPercent = function (percent){
    if(percent >= 100) { return 359.99999; } // guard against full circle
    return 360*(percent/100);
  };

  degreesToRadians = function (deg){
    return deg*Math.PI/180;
  };

  destroy = function (){
    if(current_arc) { delete current_arc; }
    paper.remove();
    delete this;
  };

  /* Draw an arc of a circle based on a center point, and dimension
   * Valid options: 
   * width      =10
   * height     =10 
   * percent    =100
   * xoffset    =0
   * yoffset    =0
   * color      =null
   */
  drawArc = function(options){
    var arc, cx, cy, sx, sy, r, x, y, path_string, center,
      arg_xoffset, arg_yoffset;

    width = options.width || 10;
    height = options.height || width;
    percent = options.percent || 100;
    xoffset = options.xoffset || 0;
    yoffset = options.yoffset || 0;
    color = options.color || "#ccc";

    arg_xoffset = xoffset||0;
    arg_yoffset = yoffset||0;
    center = getCenterOfRect(width, height, xoffset, yoffset);
    cx = center[0];
    cy = center[1];
    r = getRadiusOfRect(width,height);
    sx = width/2 + arg_xoffset; //start position
    sy = 0 + arg_yoffset; //start position
    path_string = pathStringForArcOfCircle(cx, cy, sx, sy, r, angleFromPercent(percent), 270);
    console.log("DEBUG: IN drawArc, CURRENT COLOR -----------> " + color);
    arc = paper.path(path_string).attr({stroke: color, "stroke-width": 20});
    current_arc = arc;
    return arc;
  };

  drawCircle = function (xoffset, yoffset){
    paper.circle(width/2, height/2, height/2);
  };

  getCanvas = function (){
    return paper.canvas;
  },

  getCanvasWidth = function (){
    return canvas_width;
  };

  getCanvasHeight = function (){
    return canvas_height;
  };

  getCenterOfCanvas = function (){
    return getCenterOfRect(canvas_width, canvas_height);
  };

  getCenterOfRect = function (width, height, xoffset, yoffset){
    var x,y, arg_xoffset, arg_yoffset;

    arg_xoffset = xoffset||0;
    arg_yoffset = yoffset||0;
    x = width/2 + arg_xoffset;
    y = height/2 + arg_yoffset;

    return [x,y];
  };

  getPointOnCircle = function (cx, cy, r, angle, offset){
    var angle, x, y, arg_offset;
    arg_offset = offset || 0;

    angle += offset;
    x = cx + r * Math.cos(degreesToRadians(angle));
    y = cy + r * Math.sin(degreesToRadians(angle));
    return [x,y];
  };

  // Find the radius of a circle that is inscribed within a rectangle
  getRadiusOfRect = function (width, height, xoffset, yoffset){
    if(width > height){
      return width/2;
    }else{
      return height/2;
    }
  };

  pathStringForArcOfCircle = function (cx, cy, sx, sy, r, theta, offset){
    var x, y, sweep_flag, large_sweep_flag, end_point, sweep_flags, path_string;

    end_point = getPointOnCircle(cx, cy, r, theta, 270);
    x = end_point[0];
    y = end_point[1];
    sweep_flags = sweepFlagsFromAngle(theta);
    sweep_flag = sweep_flags[0];
    large_sweep_flag = sweep_flags[1];
    path_string = "M "+sx+" "+sy+" A "+r+" "+r+" 0 "+sweep_flag+" "+large_sweep_flag+" "+x+" "+y;
    //console.log("DEBUG: path string is => ");
    //console.log(path_string);
    return path_string;
  };

  sweepFlagsFromAngle = function (angle){
    if(angle > 0 && angle <= 180){
      return [0,1];
    }else if(angle > 180 && angle <= 360){
      return [1,1];
    }else{
      return [0,0];
    }
  }

  return {
    init: init,
    adjustCanvas: adjustCanvas,
    destroy: destroy,
    drawArc: drawArc,
    getCanvas: getCanvas,
    $getCanvas: $getCanvas,
    getCanvasWidth: getCanvasWidth,
    getCanvasHeight: getCanvasHeight
  };
})(Raphael);
