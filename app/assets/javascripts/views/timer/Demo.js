PomodoroArcade.Views.DemoBaseTimer = PomodoroArcade.Views.Base.extend({
  tagName: 'div',
  className: 'timer-base',
  template: 'demo_timer_template',
  events: { 
    "click .start-btn": "startTimer",
    "click .pause-btn": "pauseTimer",
    "click .stop-btn":  "resetTimer",
  },

  initialize: function (){ 
    if(!this.model){ throw "ERROR: BaseTimer view initialized without a model"; }
    this.model.on("change:remaining_time", this._updateTime.bind(this));
  },

  pauseTimer: function (){
    this._hidePauseBtn();
    this.model.pause();
  },

  render: function (){
    var new_html;
    new_html = this._loadTemplate(this._getTemplateArgs());
    this.$el.html(new_html);
  },

  resetTimer: function (){
    this._hideStopBtn();
    this._hidePauseBtn();
    this.model.reset();
  },

  startTimer: function (){
    this._hideStartBtn();
    this._showStopBtn();
    this.model.start();
  },

  // private
  _getTemplateArgs: function (){
    if(this.model) {return this.model.presented() || {};}
  },

  _hidePauseBtn: function (){
    this.$el.find(".pause-btn").hide();
    this.$el.find(".start-btn").show();
  },

  _hideStopBtn: function (){
    this.$el.find(".stop-btn").hide();
  },

  _hideStartBtn: function (){
    this.$el.find(".start-btn").hide();
    this.$el.find(".pause-btn").show();
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
});
