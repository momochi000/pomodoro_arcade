module Progress
  class WeeklyController < Progress::BaseController
    def show
      # prepare the chart data
      @chart = Charts::WeekChart.new(current_user.activity_timers)
    end
  end
end
