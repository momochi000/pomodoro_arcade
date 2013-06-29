class ActivityTimer < ActiveRecord::Base
  belongs_to :user
  has_many :completed_pomodoros

  attr_accessible :title, :time, :break_time

  def start_timer
  end

  def stop_timer
  end
end
