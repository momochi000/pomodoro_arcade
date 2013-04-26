var GuestPomoTimer = (function ($){
  var resetTimer, setTime, startTimer, updateTimer,
    remaining_time, timer_id,
    DEFAULT_TIME, TIME_INTERVAL, DEFAULT_CONTAINER;

  timer_id = null;
  DEFAULT_CONTAINER = "guest_pomo_timer";
  DEFAULT_TIME = 24 * 60000; // 24 minutes
  TIME_INTERVAL = 1000; // 1 second
  
  remaining_time = DEFAULT_TIME;

  /* Renders the timer into the page.  If given a DOM id, it will attempt to
   * render into that id.  If the given id does not exist, it will append the
   * timer into the body.  If the timer already exists on the page, it will
   * be re-rendered
   */
  renderTimer = function (dom_id){
    var timer_element_id, $timer_element, timer_content;

    timer_element_id = dom_id || DEFAULT_CONTAINER;
    $timer_element = $('#' + timer_element_id);
    timer_content = "<div id='" + timer_element_id + "'>";
    timer_content += remaining_time;
    timer_content += "</div>";

    console.log("IN RENDER TIMER, TIMER CONTENT IS => ");
    console.log(timer_content);

    if($timer_element.length){
      $timer_element.replaceWith(timer_content);
    }else{
      $('body').append(timer_content);
    }
  };

  setTime = function (new_time){
    remaining_time = new_time;
  };

  startTimer = function (){
    timer_id = window.setInterval(updateTimer, TIME_INTERVAL, TIME_INTERVAL);
  };

  //resetTimer = 
  updateTimer = function (step){
    console.log("IN updateTimer, what is the value of step? -> " + step);
    remaining_time -= step;
    renderTimer();
  };

  pauseTimer = function (){
    if(timer_id){
      clearInterval(timer_id);
    }
  };



  return { 
    pauseTimer: pauseTimer,
    renderTimer: renderTimer,
    setTime: setTime,
    startTimer: startTimer
  };
})(jQuery);
