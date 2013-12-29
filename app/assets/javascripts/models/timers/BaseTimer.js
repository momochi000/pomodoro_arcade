PomodoroArcade.Models.BaseTimer = Backbone.Model.extend({ 
  TIMER_STARTED_PATH:         '/started',
  TIMER_COMPLETED_PATH:       '/completed',
  TIMER_PAUSED_PATH:          '/paused',
  REST_PERIOD_COMPLETED_PATH: '/rest_completed',
  VALID_STATES: ["paused, running, break"],

  defaults: {
    title: "Pomodoro",
    timer_length_minutes: 24,
    timer_length: (24 * 60000), // 24 minutes
    time_interval: 1000, // 1 second
    rest_period_minutes: 5,
    rest_period_length: (5 * 60000),
    state: "paused",
    start_time: null
  },
  
  urlRoot: "/timers",

  initialize: function (){ 
    this.set("timer_length", this.get("timer_length_minutes") * 60000);
    this.set("rest_period_length", this.get("rest_period_minutes") * 60000);
    this.set("remaining_time", this.get("timer_length"));
  },

  elapsedTime: function (){
    return(this.get("timer_length") - this.get("remaining_time"));
  },

  isPaused: function (){
    return( (this.get("state") === "paused") );
  },

  isRunning: function (){
    return( (this.get("state") === "running") );
  },

  isOnBreak: function (){
    return( (this.get("state") === "break") );
  },

  pause: function (){
    this._pauseTimer();
    this.set("state", "paused");
    this._notifyServerTimerPaused();
  },

  pctComplete: function (){
    //var pct = (this.elapsedTime() / this.get("timer_length")) * 100 ;
    //console.log("DEBUG: percent of the timer complete ---> "+pct);
    //return pct;
    //return((this.elapsedTime() / this.get("timer_length")) * 100 );
    //return((this.elapsedTime() / this.get("timer_length")) * 100 );
    return( this.get("remaining_time") / this.get("timer_length") * 100  ); //TODO: REMOVE. TEST TO START THE CIRCLE AS FULL
  },

  reset: function (){
    this._stopTimer();
    this.set("state", "paused"); // Make the state stopped?
    this.set("remaining_time", this.get("timer_length"));
  },

  start: function (){
    if(this.get("state") == "paused"){
      //TODO: STATE MACHINE REFACTOR
      this.set("state", "running");
      this._startTimer();
      return;
    }
    this.set("state", "running");
    this._resetStartTime();
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
    if(!this.id){return;}
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

  _pauseTimer: function (){
    var timer_id;
    timer_id = this.get("timer_id");
    if(timer_id){ window.clearInterval(timer_id); }
  },

  _resetStartTime: function (){
    this.set("start_time", new Date().getTime());
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
    delete this.get("start_time"); this.set("start_time", null); //deallocate
  },

  // TODO: Fire any necessary callbacks to the server
  // This essentially does the state change. Needs to be replaced with a real
  // state machine
  _timerFinished: function (){
    if(this.get("state") == "running"){ //Kick off the rest period.
      this._stopTimer();
      this._resetStartTime();
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
    //this.set("remaining_time", remaining_time); // ENABLE FOR TESTING
    this._verifyTime(); // DISABLE FOR TESTING
  },

  // Check the current time against the when the timer started
  // Update the remaining time accordingly
  _verifyTime: function (){
    var start_time, curr_time, calculated_seconds_remaining, calculated_time_remaining;

    curr_time = new Date().getTime();
    start_time = this.get("start_time");
    calculated_seconds_remaining = Math.floor((curr_time - start_time) / 1000);
    calculated_time_remaining = calculated_seconds_remaining * 1000;
    // NOTE: depending on the timer state, we either need to update by what time is left or
    switch(this.get("state")){
      case "running":
        this.set("remaining_time", (this.get("timer_length") - calculated_time_remaining));
        break;
      case "break":
        this.set("remaining_time", (this.get("rest_period_length") - calculated_time_remaining));
        break;
      default:
        throw "Timer is running in an invalid state; unable to verify time remaining";
    }
    delete curr_time; curr_time = null;
  }
});
