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
    this._bindModelEvents();
  },

  awaken: function (){
    this.delegateEvents();
  },

  destroy: function (){
    this._cleanupCircleTool();
  },

  goBack: function (){
    PomodoroArcade.router.navigate("index/", {trigger: true});
  },

  pauseTimer: function (){
    this._hidePauseBtn();
    this.model.pause();
    this._showBackBtn();
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
    this.circle_tool.destroy();
    this.circle_tool = null;
  },

  _bindModelEvents: function (){
    this.model.on("change:state", this._updateTimerButtons.bind(this));
    this.model.on("change:remaining_time", this._updateTime.bind(this));
  }, 

  _clearArc: function (){
    if(this.timer_arc){ this.timer_arc.remove(); }
  },

  _drawArc: function (){
    var center_x, center_y;
    if(!this.circle_tool){throw "Trying to draw arc while circle tool not initialized in BaseTimer";}
    center_x = 30;
    center_y = 30;
    
    this.timer_arc = this.circle_tool.drawArc(400, 400, this.model.pctComplete(), center_x, center_y);
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

  _unbindModelEvents: function (){
    this.model.off("change:state");
    this.model.off("change:remaining_time");
  },

  _updateTime: function (){
    var presenter;
    presenter = this.model.presented();
    this.$el.find(".clock .minutes").html(presenter.minutes);
    this.$el.find(".clock .seconds").html(presenter.seconds);
    this._clearArc();
    this._drawArc();
  },

  _updateTimerButtons: function (){
    switch(this.model.get("state")){
      case("paused"):
        this._hidePauseBtn();
        this._hideStopBtn();
        this._showStartBtn();
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
});
