PomodoroArcade.Router = Backbone.Router.extend({
  DEFAULT_CONTAINER_ID: "pomodoro-arcade-container",
  routes: {
    ".*":           "index",
    "index/":       "index",
    "new/":         "new",
    "show/:id":     "show"
  },

  initialize: function (options){
    this._processOptions(options);
    this.views = {};
  },

  // ROUTES/ACTIONS

  new: function (){
    console.log("DEBUG: IN NEW ACTION");
    if(!this.views.new_view){
      console.log("DEBUG: CREATING NEW VIEW");
      this.views.new_view = new PomodoroArcade.Views.New();
    }else{
      this.views.new_view.render();
    }
  },

  /*
   * Initialize and render the primary view.
   * Probably want to store all the views that get initialized,  that way we 
   * can just switch between them when we go from route to route.
   */
  index: function (){
    if(!this.views.index){
      this.views.index = new PomodoroArcade.Views.Index({collection: this.timer_collection}); // initialize and store the index view
    }else{
      this.views.index.render();
    }
  },
 
  show: function (id){
    var placeholder_timer;
    delete this.views.show; // cleanup the old view
    // TODO: Fetch/load the correct model then feed it to the view
    //   for now, just creating a placeholder model
    placeholder_timer = new PomodoroArcade.Models.BaseTimer();
    this.views.show = new PomodoroArcade.Views.BaseTimer({model: placeholder_timer});
    this.views.show.render();
    this.$container().html(this.views.show.$el);
  },

  // INSTANCE METHODS
  $container: function (){ return $("#"+this.options.container_id); },
  containerId: function (){ return this.options.container_id; },

  // private
  _initTimerCollection: function (collection_data){
    var collection_json;
    if(collection_data && !_.isEmpty(collection_data)){
      //console.log("DEBUG: GOT SOME TIMER COLLECTION DATA, LETS READ IT...");
      //console.log(collection_data);
      collection_json = JSON.parse(collection_data)
      this.timer_collection = new PomodoroArcade.Collections.TimerCollection(collection_json);
      //console.log("DEBUG: did we create teh timer collection correctly? => ");
      //console.log(this.timer_collection);
    }else{
      this.timer_collection = new PomodoroArcade.Collections.TimerCollection();
      this.timer_collection.add(new PomodoroArcade.Models.BaseTimer());
    }
  },

  _processOptions: function (opts){
    this.options = {};
    this.options.container_id = opts.container_id || this.DEFAULT_CONTAINER_ID;
    this._initTimerCollection(opts.timer_collection);
  }
});
