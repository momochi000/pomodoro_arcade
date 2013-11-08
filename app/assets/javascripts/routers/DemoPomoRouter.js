/* A chopped version of the full featured router used for non-logged in users
 */

PomodoroArcade.DemoRouter = Backbone.Router.extend({
  DEFAULT_CONTAINER_ID: "pomodoro-arcade-container",
  routes: {
    ".*": "show"
  },

  initialize: function (options){
    this._processOptions(options);
    this.views = {};
  },

  show: function (){
    var placeholder_timer;
    placeholder_timer = new PomodoroArcade.Models.BaseTimer();
    this.views.show = new PomodoroArcade.Views.DemoBaseTimer({model: placeholder_timer});
    this.views.show.render();
    this.$container().html(this.views.show.$el);
  },

  // INSTANCE METHODS
  $container: function (){ return $("#"+this.options.container_id); },
  containerId: function (){ return this.options.container_id; },

  _processOptions: function (opts){
    this.options = {};
    this.options.container_id = opts.container_id || this.DEFAULT_CONTAINER_ID;
  }
});
