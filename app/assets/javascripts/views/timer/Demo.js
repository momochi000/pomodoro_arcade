PomodoroArcade.Views.DemoBaseTimer = PomodoroArcade.Views.Base.extend({
  tagName: 'div',
  className: 'timer-base',
  template: 'demo_timer_template',
  events: { 
    "click .start-btn": "startTimer",
    "click .pause-btn": "pauseTimer"
  },

  initialize: function (){ 
    if(!this.model){ throw "ERROR: BaseTimer view initialized without a model"; }
    this.model.on("change:remaining_time", this.render.bind(this));
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
