PomodoroArcade.Views.BaseMiniTimer = PomodoroArcade.Views.Base.extend({
  template: "base_mini_timer_template",

  className: "mini-timer col-xs-12 col-sm-12 col-md-12",
  events: {
    "click": "_handleClick"
  },
  initialize: function (){},
  render: function (){
    var new_html;
    this.$el.html(this._loadTemplate(this.model.attributes));
  },

  //private

  _handleClick: function (e){
    PomodoroArcade.router.navigate("show/" + this.model.id, {trigger: true});
  }
});
