PomodoroArcade.Collections.TimerCollection = Backbone.Collection.extend({
  model: function (attrs, options){
    switch(attrs.type){
      case 'Base':
        return new PomodoroArcade.Models.BaseTimer(attrs, options);
        break;
      default: 
        return new PomodoroArcade.Models.BaseTimer(attrs, options);
        break;
    }
  },
  url: "/timers"
});
