module Charts
  class DayChart
    attr_accessor :timers, :date, :today

    def initialize(timers, date=nil)
      @timers = timers
      @today = true unless date
      @date = date || Time.now
    end

    def to_hash
      output = {}
      output['key'] = (today ? 'Pomodoros completed' : "Pomodoros completed on date ___") # TODO: fix the title when given a date
      output['color'] = '#d67777'
      values = timers.map do |t|
        {
          :label => t.title,
          :value => t.number_completed_on_day(date)
        }
      end
      output['values'] = values
      [output]
    end

    def to_json
      to_hash.to_json
    end
  end
end
