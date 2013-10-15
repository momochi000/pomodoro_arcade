/* Marty's Code */
/*
var GuestPomoTimer = (function($){
  var pauseTimer, startTimer, renderTimer, updateTimer, timerCompleteCallback,
    generatePomoTimerDiv, formatTime,
    pomoContainer,
    current_time, timerIntervalId,
    $clock_element;

  current_time = 24000;

  pomoContainer = $("<div id='pomoC'></div>");

  startTimer = function(){
    timerIntervalId = window.setInterval(updateTimer, 1000);
  };

  pauseTimer = function(){  
    window.clearInterval(timerIntervalId);
  };


  generatePomoTimerDiv = function (pomo_timer_value){
    return $("<div class='timer'>" + pomo_timer_value + "</div>")
  }

  renderTimer = function(){
    // if pomo container is not on the page
    // $('body').append("<div>" + current_time + "</div>"); //append it to the page
    // else (pomo container is on the page)
    // update it accordingly
    var found_container = $('body').find('#pomoC');
    var pomoTimerDiv = generatePomoTimerDiv(current_time);

    if( found_container.length ){ // If we can find the container on the page
      found_container.find(".timer").replaceWith(generatePomoTimerDiv(current_time));
    } else {
      $('body').append(pomoContainer);
      pomoContainer.append(pomoTimerDiv);
    }

  };

  return {
    pauseTimer: pauseTimer,
    startTimer: startTimer,
    renderTimer: renderTimer
  };

  //private

  updateTimer = function(){
    current_time -= 1000;
    //console.log("Current Time: " + current_time);
    renderTimer();
  };

  // LEFT OFF
  timerCompleteCallback = function (){
    $.ajax()
  }

})(jQuery);
*/

/* End Marty's code */

/* Zach's code: */

var GuestPomoTimer = (function ($){
  var init, renderTimer, resetTimer, setTime, startTimer, updateTimer,
    generateClockContent, generateStartBtn, generatePauseBtn,
    remaining_time, timer_id, timer_element_id, 
    DEFAULT_TIME, TIME_INTERVAL, DEFAULT_CONTAINER;

  timer_id = null;
  timer_element_id = null;
  DEFAULT_CONTAINER = "guest_pomo_timer";
  DEFAULT_TIME = 24 * 60000; // 24 minutes
  TIME_INTERVAL = 1000; // 1 second
  
  remaining_time = DEFAULT_TIME;

  init = function (timer_id_option){
    timer_element_id = timer_id_option || DEFAULT_CONTAINER;

    renderTimer();
  };

  pauseTimer = function (){
    if(timer_id){ clearInterval(timer_id); }
  };

  /* renderTimer(<String> dom_id)
   * Renders the timer into the page.  If given a DOM id, it will attempt to
   * render into that id.  If the given id does not exist, it will append the
   * timer into the body.  If the timer already exists on the page, it will
   * be re-rendered.
   */
  
  renderTimer = function (dom_id){
    var $timer_element, timer_content, clock_content,
      start_btn, pause_btn;

    timer_element_id = dom_id || timer_element_id || DEFAULT_CONTAINER;
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
  //private 

  generateClockContent = function (){
    var clock_content;
    clock_content = "<div id='clock'>";
    clock_content += formatTime(remaining_time);
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

  /* formatTime(<Integer> time_in_ms)
   *   takes a number of milliseconds and returns a string for time in "MM:SS"
   */
  formatTime = function (time_in_ms){
    var num_secs, num_minutes, remaining_secs, sec_string;
    num_secs = time_in_ms / 1000;
    num_minutes = Math.floor(num_secs / 60);
    remaining_secs = num_secs % 60;
    min_string = num_minutes+"";
    sec_string = remaining_secs+"";
    if(sec_string.length < 2) { sec_string = "0"+sec_string }
    if(min_string.length < 2) { min_string = "0"+min_string }
    return (min_string + ":" + sec_string);
  };

  return { 
    init: init,
    pauseTimer: pauseTimer,
    renderTimer: renderTimer,
    resetTimer: resetTimer, // IN FLIGHT
    setTime: setTime,
    startTimer: startTimer
  };
})(jQuery);

