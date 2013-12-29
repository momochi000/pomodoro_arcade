class Goal < ActiveRecord::Base
  belongs_to :activity_timer
end

class NullGoal
  def value
    0
  end
end
