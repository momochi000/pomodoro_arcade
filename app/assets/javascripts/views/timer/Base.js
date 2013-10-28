PomodoroArcade.Views.BaseTimer = PomodoroArcade.Views.Base.extend({
  tagName: 'div',
  className: 'timer-base',
  template: 'base_timer_template',
  events: { 
    "click .start-btn": "startTimer",
    "click .pause-btn": "pauseTimer",
    "click .back-btn": "goBack"
  },

  initialize: function (){ 
    if(!this.model){ throw "ERROR: BaseTimer view initialized without a model"; }
    this.model.on("change:remaining_time", this.render.bind(this));
  },

  goBack: function (){
    PomodoroArcade.router.navigate("index/", {trigger: true});
  },

  pauseTimer: function (){
    this.model.pause();
  },

  render: function (){
    var new_html;
    new_html = this._loadTemplate(this._getTemplateArgs(this.model.presented()));
    this.$el.html(new_html);
  },

  startTimer: function (){
    this.model.start();
  },

  // private
  _getTemplateArgs: function (){
    if(this.model) {return this.model.presented() || {};}
  }
});
