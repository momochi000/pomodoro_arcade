PomodoroArcade.Views.New = PomodoroArcade.Views.Base.extend({
  template: "timer_new_template",
  tagName: "div",
  className: "timer-new",

  events: {
    "click .create-btn": "create"
  },

  initialize: function (){
    this.render();
  },

  render: function (){
    var new_html;
    new_html = this._loadTemplate();
    PomodoroArcade.router.$container().html(this.$el.html(new_html));
  },

  // Read the values from the form and submit them to the server.
  // Then return to the index view
  create: function (){
    var new_timer;
    new_timer = new PomodoroArcade.Models.BaseTimer({
      name: this.$el.find("#new-timer-name").val(),
      timer_length_minutes: parseInt(this.$el.find("#new-timer-time").val()),
      rest_period_minutes: parseInt(this.$el.find("#new-timer-break-time").val())
    });
    new_timer.save();
  }
});
