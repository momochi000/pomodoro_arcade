PomodoroArcade.Router = Backbone.Router.extend({
  DEFAULT_CONTAINER_ID: "pomodoro-arcade-container",
  routes: {
    ".*":           "index",
    "index/":       "index",
    "show/:id":     "show"
  },

  initialize: function (options){
    this._processOptions(options);
    this._initTimerCollection();
    this.views = {};
  },

  // ROUTES/ACTIONS

  /*
   * Initialize and render the primary view.
   * Probably want to store all the views that get initialized,  that way we 
   * can just switch between them when we go from route to route.
   * 
   */
  index: function (){
    //console.log("DEBUG: IN INDEX ACTION");
    if(!this.views.index){
      //console.log("DEBUG: CREATING AND RENDERING A NEW VIEW");
      this.views.index = new PomodoroArcade.Views.Index({collection: this.timer_collection}); // initialize and store the index view
      //console.log(this.views.index);
    }else{
      //console.log("DEBUG: RENDERING THE EXISTING VIEW");
      //console.log(this.views.index);
      this.views.index.render();
    }
  },
 

  // LEFT OFF 11111111111111111111111111111111111111111111111111111
  // Move the route to the show view for this timer.
  // This view should have a model on it corresponding to the 
  // Correct timer.  Ensure that this is the case and route
  // to the correct action
  // Also, ensure that the index action does the right thing
  // when rendering, replacing the contents of the container
  // Also ensure the show action does the right thing when
  // rendering, replacing the container's contents
  // Make the show action work.

  show: function (id){
    var placeholder_timer;
    //console.log("DEBUG: IN SHOW ACTION");
    //console.log("DEBUG: ID -> " + id);
    delete this.views.show; // cleanup the old view
    // TODO: Fetch/load the correct model then feed it to the view
    //   for now, just creating a placeholder model
    placeholder_timer = new PomodoroArcade.Models.BaseTimer();
    this.views.show = new PomodoroArcade.Views.BaseTimer({model: placeholder_timer});
    this.views.show.render();
    //console.log("DEBUG: SHOW VIEW => ");
    //console.log(this.views.show);
    //console.log(this.views.show.$el);

    //console.log("DEBUG: ROUTER CONTAINER => ");
    //console.log(this.$container());
    this.$container().html(this.views.show.$el);
  },

  // INSTANCE METHODS
  $container: function (){ return $("#"+this.options.container_id); },
  containerId: function (){ return this.options.container_id; },

  // private
  _initTimerCollection: function (){
    // TODO: Do a read from the server for the current user to get their set 
    // of timers.  For now, just default with the standard pomodoro timer.
    this.timer_collection = new PomodoroArcade.Collections.TimerCollection();
    this.timer_collection.add(new PomodoroArcade.Models.BaseTimer());
  },
  _processOptions: function (opts){
    this.options = {};
    this.options.container_id = opts.container_id || this.DEFAULT_CONTAINER_ID;
  }
});
