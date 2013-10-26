/* Main view of the pomodoro app.  Stylesheet should handle proper rendering 
 * of this for the mobile platform.  We'll worry about desktop later but
 * ideally it will be responsive.  
 * This view shows a set of timers, clicking/touching one of which will send
 * to the show view.
 */

PomodoroArcade.Views.Index = PomodoroArcade.Views.Base.extend({
  template: "timer_index_template",
  tagName: "ul",
  className: "timer-collection",
  initialize: function (options){
    // Render the collection of timers on the page
    // We need to be able to have a collection which isn't bound
    // to a particular model.  The collection should handle any subtype of
    // the BaseTimer model.  Not sure exactly hwo to do that but there's
    // a post here which should start the answer
    // http://stackoverflow.com/questions/6933524/a-backbone-js-collection-of-multiple-model-subclasses
    this._initTimerCollectionViews();

    this.render();
  },

  render: function (options){
    var html, self;
    self = this;
    html = this._loadTemplate();
    this.$el.html(html);
    PomodoroArcade.router.$container().html(this.$el); // Place the view on the page correctly
    _.each(this.timer_views, function (curr_timer, index, list){
      curr_timer.render();
      self.$el.append(curr_timer.$el);
    });
  },

  _initTimerCollectionViews: function (){
    var self = this;
    this.timer_views = [];
    // initialize an array of views bound to the models in this.collection
    this.collection.each(function (element, index, list){
      self.timer_views.push(new PomodoroArcade.Views.BaseMiniTimer({model: element}));
    });
  }
});
