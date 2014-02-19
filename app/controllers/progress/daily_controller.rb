module Progress
  class DailyController < Progress::BaseController
    def show
      # prepare the chart data
      @chart = Charts::DayChart.new(current_user.activity_timers)
    end
  end
end
