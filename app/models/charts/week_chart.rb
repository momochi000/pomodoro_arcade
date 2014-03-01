module Charts
  class WeekChart
    attr_accessor :timers, :date, :today

    def initialize(timers, date=nil, options={})
      @timers = timers
      @today = true unless date
      @date = date || Time.now
    end

    def to_hash
      data
    end

    def to_json
      to_hash.to_json
    end

    private

    def data
      build_data unless @data
      @data
    end

    def build_data
      @data = []
      @data << build_timer_goal_completion
    end

    def build_timer_goal_completion
      output = {}
      output['key'] = 'Pomodoro goal achievement'
      output['color'] = '#d67777'
      output['values'] = timers.map do |t|
        {
          :label => t.title,
          :value => t.percent_of_goal_per_week(@date)
        }
      end
      output
    end
  end
end
