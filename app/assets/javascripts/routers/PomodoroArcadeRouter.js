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
    if(!this.views.new_view){
      this.views.new_view = new PomodoroArcade.Views.New();
    }else{
      this.views.new_view.render();
    }
  },

  index: function (){
    if(!this.views.index){
      this.views.index = new PomodoroArcade.Views.Index({collection: this.timer_collection}); // initialize and store the index view
    }else{
      this.views.index.render();
    }
  },
 
  show: function (id){
    var timer;
    delete this.views.show; // cleanup the old view
    timer = this.timer_collection.get(id);
    if(!timer){
      timer = new PomodoroArcade.Models.BaseTimer(); // setup a default timer cause none was found
    }
    this.views.show = new PomodoroArcade.Views.BaseTimer({model: timer, id: id});
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
      this.timer_collection = new PomodoroArcade.Collections.TimerCollection(collection_data);
    }else{
      this.timer_collection = new PomodoroArcade.Collections.TimerCollection();
      this.timer_collection.add(new PomodoroArcade.Models.BaseTimer());
    }
  },

  _processOptions: function (opts){
    this.options = {};
    this.options.container_id = opts.container_id || this.DEFAULT_CONTAINER_ID;
    this.options.endpoint = opts.endpoint || null;
    this._initTimerCollection(opts.timer_collection);
  }
});
