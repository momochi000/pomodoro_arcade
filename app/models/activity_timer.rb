class ActivityTimer < ActiveRecord::Base
  belongs_to :user
  has_many :completed_pomodoros

  attr_accessible :title, :time, :break_time

  def timer_started
  end

  def timer_stopped
  end

  def to_backbone
    {
      :title                  => title,
      :timer_length_minutes   => time
    }.to_json
  end
end
