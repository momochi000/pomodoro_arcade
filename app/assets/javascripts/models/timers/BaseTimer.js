PomodoroArcade.Models.BaseTimer = Backbone.Model.extend({ 
  TIMER_STARTED_PATH:         '/started',
  TIMER_COMPLETED_PATH:       '/completed',
  TIMER_PAUSED_PATH:          '/paused',
  REST_PERIOD_COMPLETED_PATH: '/rest_completed',

  
  defaults: {
    title: "Pomodoro",
    timer_length_minutes: 24,
    timer_length: (24 * 60000), // 24 minutes
    time_interval: 1000, // 1 second
    rest_period_minutes: 5,
    rest_period_length: (5 * 60000),
    state: "paused",
  },
  
  urlRoot: "/timers",

  initialize: function (){ 
    this.set("timer_length", this.get("timer_length_minutes") * 60000);
    this.set("rest_period_length", this.get("rest_period_minutes") * 60000);
    this.set("remaining_time", this.get("timer_length"));
  },

  is_paused: function (){
    return( (this.get("state" == "paused")) ? true : false );
  },

  pause: function (){
    this._stopTimer();
    this.set("state", "paused");
    this._notifyServerTimerPaused();
  },

  reset: function (){
    this._stopTimer();
    this.set("state", "paused"); // Make the state stopped?
    this.set("remaining_time", this.get("timer_length"));
  },

  start: function (){
    this.set("state", "running");
    this._startTimer();
    this._notifyServerTimerStart();
  },

  // Return a hash of data to be passed to an underscore template.
  presented: function (){
    var time_properties
    time_properties = {
      minutes: this._minutesRemainingString(this.get("remaining_time")),
      seconds: this._secsRemainingString(this.get("remaining_time"))
    };
    return _.extend(this.attributes, time_properties);
  },

  // private 

  /* formatTime(<Integer> time_in_ms)
   *   takes a number of milliseconds and returns a string for time in "MM:SS"
   */
  _formatTime: function (time_in_ms){
    var num_secs, num_minutes, remaining_secs, sec_string;
    num_secs = time_in_ms / 1000;
    num_minutes = Math.floor(num_secs / 60);
    remaining_secs = num_secs % 60;
    min_string = num_minutes+"";
    sec_string = remaining_secs+"";
    if(sec_string.length < 2) { sec_string = "0"+sec_string; }
    if(min_string.length < 2) { min_string = "0"+min_string; }
    return (min_string + ":" + sec_string);
  },

  _minutesRemaining: function (time_in_ms){
    var num_minutes, num_secs;
    num_secs = time_in_ms / 1000;
    return Math.floor(num_secs / 60);
  },

  _minutesRemainingString: function (time_in_ms){
    var min_string;
    min_string = this._minutesRemaining(time_in_ms)+"";
    if(min_string.length < 2) { min_string = "0"+min_string; }
    return min_string;
  },


  _notifyServer: function(url){
    //console.log("DEBUG: ABOU TO MAKE CALL TO -> " + url);
    $.ajax(url, {
      dataType: "json",
      error: function (){},
      success: function (){},
      type: "POST"
    });
  },

  _notifyServerRestPeriodCompleted: function (){
    var url = this.url() + "/rest_completed";
    this._notifyServer(url);
  },

  _notifyServerTimerCompleted: function (){
    var url = this.url() + "/completed";
    this._notifyServer(url);
  },

  _notifyServerTimerPaused: function (){
    var url = this.url() + "/paused";
    this._notifyServer(url);
  },

  _notifyServerTimerStart: function (){
    var url = this.url() + "/started";
    this._notifyServer(url);
  },

  _secsRemaining: function (time_in_ms){
    var num_secs, num_minutes, remaining_secs;
    num_minutes = this._minutesRemaining(time_in_ms);
    num_secs = time_in_ms / 1000;
    return (num_secs % 60);
  },

  _secsRemainingString: function (time_in_ms){
    var remaining_secs, sec_string;
    sec_string = this._secsRemaining(time_in_ms)+"";
    if(sec_string.length < 2) { sec_string = "0"+sec_string }
    return sec_string;
  },

  _startTimer: function (){
    this.set('timer_id', window.setInterval(this._updateTimer.bind(this), this.get('time_interval')));
  },

  _stopTimer: function (){
    var timer_id;
    timer_id = this.get("timer_id");
    if(timer_id){ window.clearInterval(timer_id); }
  },

  // TODO: Fire any necessary callbacks to the server
  _timerFinished: function (){
    if(this.get("state") == "running"){ //Kick off the rest period.
      this._stopTimer();
      this._notifyServerTimerCompleted();
      this.set("remaining_time", this.get("rest_period_length"));
      this.set("state", "break");
      this._startTimer();
    }else if(this.get("state") == "break"){
      this._notifyServerRestPeriodCompleted();
      this.reset();
    }else{
      throw "ERROR: Timer completed from an invalid state";
    }
  },

  _updateTimer: function (){
    var remaining_time

    remaining_time = this.get("remaining_time")-this.get("time_interval");
    if(remaining_time <= 0){
      this._timerFinished();
      return;
    }
    this.set("remaining_time", remaining_time);
  }
});
