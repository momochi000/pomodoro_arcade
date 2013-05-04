var GuestPomoTimer = (function ($){
  var resetTimer, setTime, startTimer, updateTimer,
    generateClockContent, generateStartBtn, generatePauseBtn,
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
   * be re-rendered.
   */
  renderTimer = function (dom_id){
    var timer_element_id, $timer_element, timer_content, clock_content,
      start_btn, pause_btn;

    timer_element_id = dom_id || DEFAULT_CONTAINER;
    // timer_element_id = DEFAULT_CONTAINER;

    $timer_element = $('#' + timer_element_id);

    if($timer_element.length){ // See if timer container exists on the page
      $clock_element = $timer_element.find("#clock");
      // See if the timer has already been built
      if($clock_element.length){ // if yes, then just update the clock
        $clock_element.replaceWith(generateClockContent());
      }else{ // if no, then draw everything (including start/pause etc)
        $timer_element.append(generateClockContent());
        $timer_element.append(generateStartBtn());
        // bind the start button to call start on the timer
        $timer_element.find('#start_btn').on("click", function (){
          startTimer();
        });
        $timer_element.append(generatePauseBtn());
        // bind the pause button to call pause on the timer
        $timer_element.find('#pause_btn').on("click", function (){
          pauseTimer();
        });
      }
    }else{ //Timer does not exist on page 
      // TODO: BUILD THIS OUT
    }
  };

  setTime = function (new_time){
    remaining_time = new_time;
  };

  startTimer = function (){
    timer_id = window.setInterval(updateTimer, TIME_INTERVAL, TIME_INTERVAL);
  };

  updateTimer = function (step){
    remaining_time -= step;
    renderTimer();
  };

  pauseTimer = function (){
    if(timer_id){ clearInterval(timer_id); }
  };

  //private 

  generateClockContent = function (){
    var clock_content;
    clock_content = "<div id='clock'>";
    clock_content += remaining_time;
    clock_content += "</div>";
    return clock_content;
  };

  generateStartBtn = function (){
    var start_btn_content;
    start_btn_content = "<div id='start_btn' class='btn btn-success'>";
    start_btn_content += "START";
    start_btn_content += "</div>";
    return start_btn_content;
  };

  generatePauseBtn = function (){
    var pause_btn_content;
    pause_btn_content = "<div id='pause_btn' class='btn btn-warning'>";
    pause_btn_content += "PAUSE";
    pause_btn_content += "</div>";
    return pause_btn_content;
  };

  return { 
    pauseTimer: pauseTimer,
    renderTimer: renderTimer,
    setTime: setTime,
    startTimer: startTimer
  };
})(jQuery);
