PomodoroArcade.Models.BaseTimer = Backbone.Model.extend({ 
  TIMER_STARTED_PATH:         '/started',
  TIMER_COMPLETED_PATH:       '/completed',
  TIMER_PAUSED_PATH:          '/paused',
  REST_PERIOD_COMPLETED_PATH: '/rest_completed',
  VALID_STATES: ["paused, paused_break, running, on_break, stopped"],

  defaults: {
    title: "Pomodoro",
    timer_length_minutes: 24,
    timer_length: (24 * 60000), // 24 minutes
    time_elapsed: 0,
    goal: null,
    time_interval: 1000, // 1 second
    rest_period_minutes: 5,
    rest_period_length: (5 * 60000),
    state: "stopped",
    start_time: null
  },
  
  urlRoot: "/timers",

  initialize: function (){ 
    this.set("timer_length", this.get("timer_length_minutes") * 60000);
    this.set("rest_period_length", this.get("rest_period_minutes") * 60000);
    this._setupStateMachine();
    this.startStateMachine();
    this.trigger("initialized");

    return this;
  },

  elapsedTime: function (){
    //return(this.get("timer_length") - this.get("remaining_time"));
    return(this._calculateTimeElapsed() * 1000);
  },

  isPaused: function (){
    return( this.currentState === "paused" );
  },

  isRunning: function (){
    return( this.currentState === "running" );
  },

  isOnBreak: function (){
    return( this.currentState === "on_break" );
  },

  pause: function (){
    this.trigger("pause");
  },

  //TODO: STATE MACHINE REFACTOR
  pctComplete: function (){
    //var pct = (this.elapsedTime() / this.get("timer_length")) * 100 ;
    //console.log("DEBUG: percent of the timer complete ---> "+pct);
    //return pct;

    //return((this.elapsedTime() / this.get("timer_length")) * 100 );

    if(this.currentState == "on_break" || this.currentState == "paused_break"){
      console.log("PCT COMPLETE CALLED ON BREAK");
      return( this.get("remaining_time") / this.get("rest_period_length") * 100  ); //TODO: REMOVE. TEST TO START THE CIRCLE AS FULL
    }else{
      console.log("PCT COMPLETE CALLED OTHERWISE");
      return( this.get("remaining_time") / this.get("timer_length") * 100  ); //TODO: REMOVE. TEST TO START THE CIRCLE AS FULL
    }
  },

  reset: function (){
    this.trigger("reset");
  },

  start: function (){
    console.log("DEBUG: IN BASE TIMER start();  Current state -> "+ this.currentState + "Triggering start on state machine...");
    this.trigger("start");
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


  _notifyServer: function (url){
    if(!this.id){return;}
    $.ajax(url, {
      dataType: "json",
      error: function (){},
      success: function (){},
      type: "POST"
    });
  },
  
  _notifyServerAtPath: function (path){
    var url = this.url() + path;
    this._notifyServer(url);
  },

  _notifyServerRestPeriodStarted: function (){
    this._notifyServerAtPath("/rest_started");
  },

  _notifyServerRestPeriodCompleted: function (){
    this._notifyServerAtPath("/rest_completed");
  },

  _notifyServerTimerCompleted: function (){
    this._notifyServerAtPath("/completed");
  },

  _notifyServerTimerPaused: function (){
    this._notifyServerAtPath("/paused");
  },

  _notifyServerTimerStart: function (){
    this._notifyServerAtPath("/started");
  },

  _pauseTimer: function (){
    var timer_id;
    timer_id = this.get("timer_id");
    if(timer_id){ window.clearInterval(timer_id); }
  },

  _resetTimer: function(){
    this._stopTimer();
    this._windClock();
    this._resetStartTime();
    this._resetElapsedTime();
  },

  _recordElapsedTime: function (){
    this.set("elapsed_time", this._calculateTimeElapsed());
  },

  _resetElapsedTime: function (){
    this.set("elapsed_time", 0);
  },

  _resetRemainingTime: function (){
    this.set("remaining_time", 0);
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

  _setupStateMachine: function (){
    var self = this;
    _.extend(this, Backbone.StateMachine, Backbone.Events, {
      states: {
        on_break: {},
        paused: { enter: [self._recordElapsedTime, self._pauseTimer, self._notifyServerTimerPaused] },
        paused_break: {},
        running: {},
        stopped: { enter: [self._resetTimer] },
      },
      transitions: {
        init: { initialized: "stopped" },

        on_break: {
          pause: { enterState: "paused_break",
            callbacks: []
          },
          finish: { enterState: "stopped",
            callbacks: ["completeBreakTimer"]
          },
          reset: { enterState: "stopped",
            callbacks: ["resetTimer"]
          },
        },

        paused: {
          reset: { enterState: "stopped",
            callbacks: ["resetTimer"]
          },
          start: { enterState: "running",
            callbacks: ["resumeTimer"]
          }
        },

        paused_break: {
          reset: { enterState: "stopped",
            callbacks: ["resetTimer"]
          },
          start: { enterState: "on_break",
            callbacks: ["resumeTimer"]
          }
        },

        running: {
          pause: { enterState: "paused",
            callbacks: []
          },
          reset: { enterState: "stopped",
            callbacks: ["resetTimer"]
          },
          finish: { enterState: "on_break",
            callbacks: ["completeTimer", "prepareBreakTimer", "resumeTimer"]
          }
        },

        stopped: {
          start: { enterState: "running",
            callbacks: ["prepareTimer", "startTimer", "notifyServerTimerStart"]
          }
        }
      },

      //callbacks
      completeBreakTimer: function (){
        self._notifyServerRestPeriodCompleted();
      },

      completeTimer: function (){
        console.log("DEBUG: in complete timer callback...");
        self._stopTimer();
        self._notifyServerTimerCompleted();
      },

      notifyServerTimerStart: function (){
        self._notifyServerTimerStart();
      },

      notifyServerBreakStarted: function (){ 
        self._notifyServerRestPeriodStarted();
      },

      pauseRunningTimer: function (){
        self._pauseTimer();
        self._notifyServerTimerPaused();
      },

      prepareBreakTimer: function (){
        console.log("DEBUG: preparing break timer (callback)");
        self._windBreakClock();
        self._resetStartTime();
        self._resetElapsedTime();
      },

      prepareTimer: function (){
        self._windClock();
        self._resetStartTime();
        self._resetElapsedTime();
      },

      recordElapsedTime: function (){
        self._recordElapsedTime();
      },

      resetTimer: function (){
        self._resetTimer();
      },

      resumeTimer: function (){
        self._resetStartTime();
        self._startTimer();
      },

      startBreakTimer: function (){
        self._windBreakClock();
        self._resetStartTime();
        self._startTimer();
      },

      startTimer: function (){
        self._windClock();
        self._resetStartTime();
        self._startTimer();
      }
    });
  },

  _startTimer: function (){
    console.log("DEBUG: STARTING THE TIMER ====>");
    this.set("timer_id", window.setInterval(this._updateTimer.bind(this), this.get("time_interval")));
    console.log(this.get("timer_id"));
  },

  _stopTimer: function (){
    var timer_id;
    timer_id = this.get("timer_id");
    if(timer_id){ window.clearInterval(timer_id); }
    delete this.get("start_time"); this.set("start_time", null); //deallocate
  },

  _updateTimer: function (){
    var total_elapsed_time, remaining_time;

    //remaining_time = this.get("remaining_time")-this.get("time_interval");
    //if(remaining_time <= 0){
    //  console.log("DEBUG: in update timer, triggering finish, currentState ---> " + this.currentState);
    //  this.trigger("finish");
    //  return;
    //}

    //this.set("remaining_time", remaining_time); // ENABLE FOR TESTING
    total_elapsed_time = this._calculateTimeElapsed(); // DISABLE FOR TESTING
    // TODO: STATE MACHINE REFACTOR
    if(this.currentState == "running"){
      remaining_time = this.get("timer_length") - total_elapsed_time*1000;
    }else if(this.currentState == "on_break"){
      remaining_time = this.get("rest_period_length") - total_elapsed_time*1000;
    }else{
      throw "Attempting to update timer in an invalid state"
    }
    //console.log("DEBUG: timer_length is ---> " + this.get("timer_length"));
    //console.log("DEBUG: remaining_time calculation is -->" + remaining_time);
    if(remaining_time <= 0){
      console.log("DEBUG: in update timer, triggering finish, currentState ---> " + this.currentState);
      this.trigger("finish");
      return;
    }
    this.set("remaining_time", remaining_time);
  },

  // Check the current time against the when the timer started
  // Update the remaining time accordingly
  _calculateTimeElapsed: function (){
    var start_time, curr_time, seconds_elapsed, elapsed_previously;

    //console.log("DEBUG: in _calculateTimeElapsed~~~~~~~~~~");
    curr_time = new Date().getTime();
    start_time = this.get("start_time");
    //console.log("DEBUG: curr_time               -> " + curr_time);
    //console.log("DEBUG: start_time              -> " + start_time);

    elapsed_previously = this.get("elapsed_time");

    //console.log("DEBUG: previously_elapsed      -> " + elapsed_previously);

    seconds_elapsed = Math.floor(((curr_time - start_time) / 1000) + elapsed_previously);

    delete curr_time; curr_time = null;
    //console.log("DEBUG: seconds elapsed is --->" + seconds_elapsed);
    return seconds_elapsed;
  },

  _windClock: function (){
    this.set("remaining_time", this.get("timer_length"));
  },

  _windBreakClock: function (){
    this.set("remaining_time", this.get("rest_period_length"));
  }
});
