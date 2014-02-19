PomodoroArcade.Charts = {};
PomodoroArcade.Charts.BarChart = (function (d3, nv, _, $){
  var create, 
    BarChart,

  BarChart = function (container, data){
    this.data = data;
    this.container = container;
    this.$container = $(container);
    if(_.isEmpty(this.$container)){throw "Container element __"+container+"__for the bar chart was not found";}
  };

  BarChart.prototype.render = function (){
    var self = this;
    nv.addGraph(function() {
      var chart = nv.models.multiBarHorizontalChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .margin({top: 30, right: 20, bottom: 50, left: 175})
        .showValues(true)           //Show bar value next to each bar.
        .tooltips(true)             //Show tooltips on hover.
        .transitionDuration(350)
        .showControls(true);        //Allow user to switch between "Grouped" and "Stacked" mode.
 
      chart.yAxis
        .tickFormat(d3.format(',.2f'));
 
      d3.select(self.container)
        .datum(self.data)
        .call(chart);
 
      nv.utils.windowResize(chart.update);
 
      return chart;
    }); 
  };

  create = function (container_selector, json_data){
    return new BarChart(container_selector, json_data);
  };

  return {create: create};
})(d3, nv, _, jQuery);

