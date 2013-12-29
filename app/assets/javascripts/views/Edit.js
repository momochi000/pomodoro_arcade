PomodoroArcade.Views.Edit = PomodoroArcade.Views.Base.extend({
  template: "timer_edit_template",
  tagName: "div",
  className: "timer-edit",

  events: {
    "click .save-btn": "save",
    "click .back-btn": "goBack"
  },

  initialize: function (){
    this.render();
  },

  render: function (){
    var new_html;
    new_html = this._loadTemplate();
    PomodoroArcade.router.$container().html(this.$el.html(new_html));
    this.delegateEvents();
  },

  // Read the values from the form and submit them to the server.
  // Then return to the index view
  save: function (){
    var new_timer, new_timer_attrs;

    this.model.set("goal", parseInt(this.$el.find("#edit-timer-goal").val()));
    this.model.save({
      wait: true,
      success: function (){
        console.log("DEBUG: SUCCESSFUL SAVE!!!!");
        PomodoroArcade.router.navigate("index/", {trigger: true});
      },
      error: function (){
        console.log("DEBUG: ERROR WHILE ATTEMPTING TO UPDATE EXISTING TIMER");
      }
    });
  },

  goBack: function (){
    PomodoroArcade.router.navigate("index/", {trigger: true});
  }


});
