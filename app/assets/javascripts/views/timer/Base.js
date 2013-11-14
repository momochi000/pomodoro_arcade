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
    this.model.on("change:remaining_time", this._updateTime.bind(this));
    this._bindModelEvents();
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
  },

  resetTimer: function (){
    this._hideStopBtn();
    this._hidePauseBtn();
    this._showBackBtn();
    this.model.reset();
  },

  startTimer: function (){
    this._hideStartBtn();
    this._showStopBtn();
    this._hideBackBtn();
    this.model.start();
  },

  // private

  _bindModelEvents: function (){
    this.model.on("change:state", this._updateTimerButtons.bind(this));
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

  _updateTime: function (){
    var presenter;
    presenter = this.model.presented();
    this.$el.find(".clock .minutes").html(presenter.minutes);
    this.$el.find(".clock .seconds").html(presenter.seconds);
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
