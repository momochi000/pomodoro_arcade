PomodoroArcade.Views.BaseMiniTimer = PomodoroArcade.Views.Base.extend({
  template: "base_mini_timer_template",
  tagName: "li",
  events: {
    "click": "_handleClick"
  },
  initialize: function (){},
  render: function (){
    var new_html;
    this.$el.html(this._loadTemplate());
  },

  //private

  _handleClick: function (e){
    //console.log("DEBUG: GOT A CLICK EVENT ON A BASEMINITIMER");
    //console.log(e);
    //console.log(this);
    //console.log("DEBUG: ROUTING TO -> " + "show/" + this.model.id );
    PomodoroArcade.router.navigate("show/" + this.model.id, {trigger: true});
  }
});
