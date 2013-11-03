class ActivityTimer < ActiveRecord::Base
  belongs_to :user
  has_many :completed_pomodoros

  attr_accessible :title, :time, :break_time

  def self.new_from_backbone(params, user=nil)
    new_timer = self.new
    new_timer.from_backbone(params, user)
  end

  def self.create_from_backbone(params, user=nil)
    new_timer = new_from_backbone(params, user)
    new_timer.save
    new_timer
  end

  # Returns a mapping of model attributes to their corresponding backbone 
  # attributes (which may be named differently)
  def attrs_to_backbone_attrs
    {
      :title      => 'title',
      :time       => 'timer_length_minutes',
      :break_time => 'rest_period_minutes',
      :id         => 'id'
    }
  end

  def timer_started
  end

  def timer_stopped
  end

  def to_backbone
    output = {}
    attrs_to_backbone_attrs.each do |k,v|
      output[v] = self[k.to_sym].to_s
    end
    p "DEBUG: OUTPUTTING TIMER TO BACKBONE => "
    p self
    p output
    output
  end

  # Takes a hash which came from a backbone model and sets the correct 
  # attributes of self
  def from_backbone(params, user=nil)
    attrs_to_backbone_attrs.each do |k,v|
      self.public_send("#{k}=", params[v])
    end
    self.user = user if user
    self
  end
end

