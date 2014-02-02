# Currently, a timer has many goals.  But really a timer only has a single goal.
# Multiple goals are supported because changing the goal is non-destructive.
# Only the most current goal counts as the actual goal.  Past goals are
# maintained for historical purposes
class Goal < ActiveRecord::Base
  belongs_to :activity_timer
end

class NullGoal
  def value
    0
  end
end
