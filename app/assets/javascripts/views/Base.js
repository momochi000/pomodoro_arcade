PomodoroArcade.Views.Base = Backbone.View.extend({
  template: "STUB",
  initialize: function (){
    console.log("DEBUG: NOTHING SHOULD BE HAPPENING HERE>>>>");
  },

  _loadTemplate: function (opts){
    opts = opts || {};
    //console.log("DEBUG: loadTemplate in base view");
    //console.log("DEBUG: Can we find the template? -> "+this.template +"   =====> ");
    //console.log($("#"+this.template));
    return(_.template($('#'+this.template).html(), opts));
  },

  // Unbind all events, etc.
  sleep: function (){
    this.undelegateEvents();
  },

  // Rebind events
  awaken: function (){
    this.delegateEvents();
  }
});
