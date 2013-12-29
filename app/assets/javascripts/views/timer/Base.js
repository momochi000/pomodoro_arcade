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
    this._COLOR_REST = "rgb(4, 137, 190)";
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
    this._hidePauseBtn();
    this.model.pause();
    this._showBackBtn();
    this._drawArc(); // TODO: STATE MACHINE REFACTOR
  },

  render: function (){
    var new_html;
    new_html = this._loadTemplate(this._getTemplateArgs());

    this.$el.html(new_html);
    this._initializeCircleTool();
  },

  resetTimer: function (){
    this._hideStopBtn();
    this._hidePauseBtn();
    this._showBackBtn();
    this.model.reset();
  },

  sleep: function (){
    this.undelegateEvents();
    this._cleanupCircleTool();
  },

  startTimer: function (){
    this._hideStartBtn();
    this._showStopBtn();
    this._hideBackBtn();
    this.model.start();
    this._drawArc(); // TODO: STATE MACHINE REFACTOR
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
    this.model.on("change:state", this._updateTimerButtons.bind(this));
    this.model.on("change:remaining_time", this._updateTime.bind(this));
    this.model.on("change:state", this._playSound.bind(this));
    this.model.on("change:state", this._updateIcon.bind(this));
    this.model.on("change:state", this._updateColor.bind(this));
  }, 

  _changeTimerRingColor: function (){
    //interface with raphael bit   
    if(!this.circle_tool){return null;}
    //this.circle_tool.
  },

  _clearArc: function (){
    if(this.timer_arc){ this.timer_arc.remove(); }
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
    console.log("DEBUG: in play sound (which means we got a change:state event on the model) model --> "+this.model.get('state'));
    if(this.model.isOnBreak()){
      console.log("DEBUG: _playSound called ~~~~~~~~~~~~~~~~~~~~~~~~~");
      this.audio.play();
    }
  },

  _restIcon: function (){
    return "<div class=\"rest-icon large-timer-icon\"></div>";
  },

  _runningIcon: function (){
    return "<i class=\"large-timer-icon fa fa-clock-o\"></i>";
  },

  _showBackBtn: function (){
    this.$el.find(".back-btn").show();
  },

  _showPauseBtn: function (){
    this.$el.find(".pause-btn").show();
  },

  _showStartBtn: function (){
    this.$el.find(".start-btn").show();
  },

  _showStopBtn: function (){
    this.$el.find(".stop-btn").show();
  },

  // TODO: STATE MACHINE REFACTOR
  _updateColor: function (){
    switch(this.model.get("state")){
      case("paused"):
        this.timer_color = this._COLOR_PAUSED;
        break;
      case("running"):
        this.timer_color = this._COLOR_RUNNING;
        break;
      case("break"):
        this.timer_color = this._COLOR_REST;
        this.$el.find(".large-timer-icon").replaceWith($(this._restIcon()));
        break;
      default:
        this.timer_color = null;
    };
    return this;
  },

  // TODO: STATE MACHINE REFACTOR
  // I can tell this is really bad, this will need to stay in sync with any
  // markup changes on the timer template.
  _updateIcon: function (){
    switch(this.model.get("state")){
      case("paused"):
        break;
      case("running"):
        this.$el.find(".large-timer-icon").replaceWith($(this._runningIcon()));
        break;
      case("break"):
        this.$el.find(".large-timer-icon").replaceWith($(this._restIcon()));
        break;
      default:
        break;
    };
  },

  _updateTime: function (){
    var presenter;
    presenter = this.model.presented();
    this.$el.find(".clock .minutes").html(presenter.minutes);
    this.$el.find(".clock .seconds").html(presenter.seconds);
    this._clearArc();
    this._drawArc();
  },

  // TODO: STATE_MACHINE_REFACTOR
  _updateTimerButtons: function (){
    switch(this.model.get("state")){
      case("paused"):
        this._hidePauseBtn();
        this._hideStopBtn();
        this._showStartBtn();
        this._showBackBtn();
        break;
      case("running"):
        this._hideStartBtn();
        this._showPauseBtn();
        this._showStopBtn();
        break;
      case("break"):
        this._hideStartBtn();
        this._showPauseBtn();
        this._showStopBtn();
        break;
      default:
        break;
    }
  },
  _unbindModelEvents: function (){
    this.model.off("change:state");
    this.model.off("change:remaining_time");
  }
});
