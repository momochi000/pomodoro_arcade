module Charts
  class DayChart
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
      @data << build_timers_complete_on_date
      @data << build_timer_goals_on_date
      @data << build_velocities_on_date
    end

    def build_timers_complete_on_date
      output = {}
      output['key'] = (today ? 'Pomodoros completed' : "Pomodoros completed on date ___") # TODO: fix the title when given a date
      output['color'] = '#d67777'
      output['values'] = timers.map do |t|
        {
          :label => t.title,
          :value => t.number_completed_on_day(date)
        }
      end
      output
    end

    def build_timer_goals_on_date
      output = {}
      output['key'] = (today ? 'Goals' : "Pomodoros goals on date ___") # TODO: fix the title when given a date

      output['color'] = 'gold'
      output['values'] = timers.map do |t|
        {
          :label => t.title,
          :value => t.goal.value
        }
      end
      output
    end

    def build_velocities_on_date
      output = {}

      output['key'] = (today ? 'Velocity' : "Velocity on date ___") # TODO: fix the title when given a date

      output['color'] = 'green'
      output['values'] = timers.map do |t|
        {
          :label => t.title,
          :value => t.velocity(:precision => :float)
        }
      end
      output
    end
  end
end
