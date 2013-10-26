PomodoroArcade.Views.BaseTimer = PomodoroArcade.Views.Base.extend({
  tagName: 'div',
  className: 'timer-base',
  template: 'base_timer_template',
  events: { 
    "click .start-btn": "startTimer",
    "click .pause-btn": "pauseTimer"
  },

  initialize: function (){ 
    if(!this.model){ throw "ERROR: BaseTimer view initialized without a model"; }
    this.model.on("change:remaining_time", this.render.bind(this));
  },

  render: function (){
    var new_html;
    // LEFT OFF 222222222222222222222222222222222222222222222
    // Pass the appropriate arguments to the template
    // Also make the template 
    new_html = this._loadTemplate(this._getTemplateArgs(this.model.presented()));
    this.$el.html(new_html);
  },

  startTimer: function (){
    this.model.start();
  },

  pauseTimer: function (){
    // call pause timer on this.model
    // render() should be smarter and display properly when the timer is paused.
  },

  // private
  _getTemplateArgs: function (){
    if(this.model) {return this.model.presented() || {};}
  }
});
