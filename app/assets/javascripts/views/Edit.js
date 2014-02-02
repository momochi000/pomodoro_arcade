PomodoroArcade.Views.Edit = PomodoroArcade.Views.Base.extend({
  template: "timer_edit_template",
  tagName: "div",
  className: "timer-edit",

  events: {
    "click .save-btn": "save",
    "click .back-btn": "goBack",
    "click .delete-btn": "deletePomo"
  },

  initialize: function (){
    this.render();
  },

  render: function (){
    var new_html;
    
    new_html = this._loadTemplate(this._getTemplateArgs());
    PomodoroArcade.router.$container().html(this.$el.html(new_html));
    this.delegateEvents();
  },

  // Read the values from the form and submit them to the server.
  // Then return to the index view
  save: function (){
    var new_timer, new_timer_attrs;

    this.model.set("title", (this.$el.find("#edit-timer-title").val()));
    this.model.set("goal", parseInt(this.$el.find("#edit-timer-goal").val()));
    this.model.save(null, {
      wait: true,
      success: function (model, response, options){
        PomodoroArcade.router.navigate("index/", {trigger: true});
      },
      error: function (model, xhr, options){
        console.log("DEBUG: ERROR WHILE ATTEMPTING TO UPDATE EXISTING TIMER");
      }
    });
  },

  deletePomo: function (){
    var conf = confirm("Are you sure you wish to delete the " + this.model.get("title") + " timer?");
    if (conf === true) {
      PomodoroArcade.router.navigate("delete/"+this.model.get("id"), {trigger: true});
    }
  },

  goBack: function (){
    PomodoroArcade.router.navigate("index/", {trigger: true});
  },

  _getTemplateArgs: function (){
    if(this.model) {return this.model.presented() || {};}
  }
});
