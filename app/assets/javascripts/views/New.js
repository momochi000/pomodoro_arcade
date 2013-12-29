PomodoroArcade.Views.New = PomodoroArcade.Views.Base.extend({
  template: "timer_new_template",
  tagName: "div",
  className: "timer-new",

  events: {
    "click .create-btn": "create",
    "click .back-btn":   "goBack"
  },

  initialize: function (){
    this.render();
  },

  render: function (){
    var new_html;
    new_html = this._loadTemplate();
    // TODO: This is smelly, should move the container into an initialize option.  The base view behavior can fall back to this in case the container isn't set
    PomodoroArcade.router.$container().html(this.$el.html(new_html));
    this.delegateEvents();
  },

  // Read the values from the form and submit them to the server.
  // Then return to the index view
  create: function (){
    var new_timer, new_timer_attrs;
    new_timer_attrs = {
      title: this.$el.find("#new-timer-name").val(),
      timer_length_minutes: parseInt(this.$el.find("#new-timer-time").val()),
      rest_period_minutes: parseInt(this.$el.find("#new-timer-break-time").val()),
      goal: parseInt(this.$el.find("#new-timer-goal").val())
    }

    PomodoroArcade.router.timer_collection.create(
      new_timer_attrs, {
      wait: true, 
      success: function (){
        console.log("DEBUG: SUCCESSFUL SAVE!!!!");
        PomodoroArcade.router.navigate("index/", {trigger: true});
      },
      error: function (){
        console.log("DEBUG: ERROR WHILE ATTEMPTING TO CREATE NEW TIMER");
      }
    });
  },

  goBack: function (){
    PomodoroArcade.router.navigate("index/", {trigger: true});
  }
});
