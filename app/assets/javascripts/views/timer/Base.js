PomodoroArcade.Views.BaseTimer = PomodoroArcade.Views.Base.extend({
  tagName: 'div',
  className: 'timer-base',
  template: 'base_timer_template',
  events: { 
    "click .start-btn": "startTimer",
    "click .pause-btn": "pauseTimer",
    "click .stop-btn":  "resetTimer",
    "click .back-btn": "goBack"
  },

  initialize: function (){ 
    if(!this.model){ throw "ERROR: BaseTimer view initialized without a model"; }
    this._COLOR_RUNNING = "rgb(121, 119, 46)";
    this._COLOR_PAUSED = "rgb(180, 209, 215)";
    this._COLOR_ON_BREAK = "rgb(4, 137, 190)";
    this._initializeAudio();
    this._bindModelEvents();
  },

  awaken: function (){
    this.delegateEvents();
  },

  destroy: function (){
    this._cleanupCircleTool();
    delete this.audio;
    this.remove();
    delete this;
  },

  goBack: function (){
    this.model.reset();
    PomodoroArcade.router.navigate("index/", {trigger: true});
  },

  pauseTimer: function (){
    this.model.pause();
  },

  render: function (){
    var new_html;
    new_html = this._loadTemplate(this._getTemplateArgs());

    this.$el.html(new_html);
    this._initializeCircleTool();
  },

  resetTimer: function (){
    this.model.reset();
  },

  sleep: function (){
    this.undelegateEvents();
    this._cleanupCircleTool();
  },

  startTimer: function (){
    this.model.start();
  },

  // Overridden Backbone methods

  delegateEvents: function (){
    Backbone.View.prototype.delegateEvents.call(this);
    this._bindModelEvents();
  },

  undelegateEvents: function (){
    Backbone.View.prototype.undelegateEvents.call(this);
    this._unbindModelEvents();
  },

  // private

  _cleanupCircleTool: function (){
    if(this.circle_tool){this.circle_tool.destroy()};
    this.circle_tool = null;
  },

  // TODO STATE MACHINE REFACTOR
  _bindModelEvents: function (){
    // Update display when the model time changes
    this.model.on("change:remaining_time", this._updateTime.bind(this));
    
    // Redraw the timer arc whenever there's a transition
    this.model.on("transition", this._drawArc.bind(this));

    // Update controls based on state
    this.model.on("enterState:paused", this._displayPausedControls.bind(this));
    this.model.on("enterState:running", this._displayRunningControls.bind(this));
    this.model.on("enterState:stopped", this._displayPausedControls.bind(this));
    this.model.on("enterState:on_break", this._displayBreakControls.bind(this));

    // Update clock color based on state
    this.model.on("enterState:paused", this._updateClockColor.bind(this, this._COLOR_PAUSED));
    this.model.on("enterState:running", this._updateClockColor.bind(this, this._COLOR_RUNNING));
    this.model.on("enterState:stopped", this._updateClockColor.bind(this, 'red'));
    this.model.on("enterState:on_break", this._updateClockForBreak.bind(this));

    // Change clock icon based on state
    this.model.on("enterState:running", this._showStandardClockIcon.bind(this));
    this.model.on("enterState:stopped", this._showStandardClockIcon.bind(this));
    this.model.on("enterState:break", this._showBreakIcon.bind(this));

    // Play sound when timer completes
    this.model.on("enterState:on_break", this._playSound.bind(this));
  }, 

  _clearArc: function (){
    if(this.timer_arc){ this.timer_arc.remove(); }
  },

  _displayPausedControls: function (){
    this._hidePauseBtn();
    this._hideStopBtn();
    this._showStartBtn();
    this._showBackBtn();
  },

  _displayRunningControls: function (){
    this._hideStartBtn();
    this._hideBackBtn();
    this._showPauseBtn();
    this._showStopBtn();
  },

  _displayBreakControls: function (){
    this._hideStartBtn();
    this._showPauseBtn();
    this._showStopBtn();
  },

  _drawArc: function (){
    var center_x, center_y, color;
    if(!this.circle_tool){throw "Trying to draw arc while circle tool not initialized in BaseTimer";}
    this._clearArc();
    center_x = 30;
    center_y = 30;

    this.timer_arc = this.circle_tool.drawArc({
      width: 400, 
      height: 400, 
      percent: this.model.pctComplete(), 
      xoffset: center_x, 
      yoffset: center_y,
      color: this.timer_color
    });
  },

  _getModelState: function (){
    this.model.currentState;
  },

  _getTemplateArgs: function (){
    if(this.model) {return this.model.presented() || {};}
  },

  _hideBackBtn: function (){
    this.$el.find(".back-btn").hide();
  },

  _hidePauseBtn: function (){
    this.$el.find(".pause-btn").hide();
    this._showStartBtn();
  },

  _hideStopBtn: function (){
    this.$el.find(".stop-btn").hide();
  },

  _hideStartBtn: function (){
    this.$el.find(".start-btn").hide();
    this._showPauseBtn();
  },

  _initializeAudio: function (){
    var audio = PomodoroArcade.Models.PomAudio.create("assets/farm003.mp3");
    this.audio = audio;
  },

  _initializeCircleTool: function (){
    var h, w, svg_container;
    if(!this.circle_tool) {
      // NOTE: Width & height not available yet because the view hasn't been inserted into the page yet
      w = (this.$el.width() > 0)  ? this.$el.width()  : 700;
      h = (this.$el.height() > 0) ? this.$el.height() : 700;
      this.circle_tool = DrawCircle.init(this.$el.find(".svg-wrap").get(0), h, w);
      $(this.circle_tool.getCanvas()).css({position: "absolute"});
    }
  },

  _playSound: function (){
    console.log("DEBUG: in play sound (which means we got a change:state event on the model) model --> "+this._getModelState());
    if(this.model.isOnBreak()){
      console.log("DEBUG: _playSound called ~~~~~~~~~~~~~~~~~~~~~~~~~");
      this.audio.play();
    }
  },

  _onBreakIcon: function (){
    return "<div class=\"rest-icon large-timer-icon\"></div>";
  },

  _runningIcon: function (){
    return "<i class=\"large-timer-icon fa fa-clock-o\"></i>";
  },

  _showBackBtn: function (){
    this.$el.find(".back-btn").show();
  },

  _showBreakIcon: function (){
    this.$el.find(".large-timer-icon").replaceWith($(this._onBreakIcon()));
  },

  _showPauseBtn: function (){
    this.$el.find(".pause-btn").show();
  },

  _showStandardClockIcon: function (){
    this.$el.find(".large-timer-icon").replaceWith($(this._runningIcon()));
  },

  _showStartBtn: function (){
    this.$el.find(".start-btn").show();
  },

  _showStopBtn: function (){
    this.$el.find(".stop-btn").show();
  },

  _updateClockColor: function (color){
    this.timer_color = color;
  },

  _updateClockForBreak: function (){
    this._updateClockColor(this._COLOR_ON_BREAK);
    this._showBreakIcon();
  },

  _updateTime: function (){
    var presenter;
    presenter = this.model.presented();
    this.$el.find(".clock .minutes").html(presenter.minutes);
    this.$el.find(".clock .seconds").html(presenter.seconds);
    this._clearArc(); //TODO: See if this is needed, clear is already called in drawArc
    this._drawArc();
  },

  _unbindModelEvents: function (){
    this.model.off("change:remaining_time");
    this.model.off("enterState:paused");
    this.model.off("enterState:running");
    this.model.off("enterState:stopped");
    this.model.off("enterState:on_break");
    this.model.off("transition");
  }
});
