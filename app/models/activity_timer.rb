class ActivityTimer < ActiveRecord::Base
  belongs_to :user
  has_many :completed_events, :as => :target, :class_name => 'Event::Timer::UserCompletedTimer'
  has_many :started_events, :as => :target, :class_name => 'Event::Timer::UserStartedTimer'
  has_many :rest_completed_events, :as => :target, :class_name => 'Event::Timer::UserCompletedRestPeriod'

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

  def completed
    Event::Timer::UserCompletedTimer.create(:target => self)
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

  # Number of this timer completed by a given user
  def number_completed
    completed_events.count
  end
  alias_method :num_completed, :number_completed 

  # Number of times the full timer cycle has completed including rest period
  def number_fully_completed
    rest_completed_events.count
  end

  def rest_completed
    Event::Timer::UserCompletedRestPeriod.create(:target => self)
  end

  def started
    Event::Timer::UserStartedTimer.create(:target => self)
  end

  def to_backbone
    output = {}
    attrs_to_backbone_attrs.each do |k,v|
      output[v] = self[k.to_sym].to_s
    end
    output
  end
end

