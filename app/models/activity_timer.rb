class ActivityTimer < ActiveRecord::Base
  belongs_to :user
  has_many :events, :as => :target, :class_name => 'Event'
  has_many :goals, :autosave => true
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
      :id         => 'id',
      :goal       => 'goal'
    }
  end

  def completed
    Event::Timer::UserCompletedTimer.create(:target => self)
  end

  def completed_events_on_day(date)
    completed_events.where("created_at >= :start_date AND created_at <= :end_date", {
      :start_date => date.beginning_of_day,
      :end_date => date.end_of_day});
  end

  def completed_events_today
    completed_events_on_day(Time.now)
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

  def goal
    if goals.empty?
      NullGoal.new
    else
      # NOTE: Smell here, have to return goals.first if none of the goals are 
      #   persisted, since created_at will be nil
      goals.order("created_at DESC").first || goals.first
    end
  end

  def goal=(value)
    create_new_goal(value)
  end

  # TO BE IMPLEMENTED
  def goal_reached?(date=nil)
    raise "IMPLEMENT ME"
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

  def number_completed_events_today
    completed_events_today.count
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
      if v=='goal'
        output[v] = goal.value # TODO: SMELLY?.. KNOWLEDGE OF GOAL IS REQUIRED
      else
        output[v] = self[k.to_sym].to_s
      end
    end
    output
  end

  # The average number of pomos completed per day on this timer over the past 10 days
  def velocity
    completed_events_per_day = (1..10).map do |itor|
      completed_events_on_day(Time.now - itor.days)
    end.map(&:count)
    completed_events_per_day.sum / completed_events_per_day.count
  end

  private

  def create_new_goal(new_value=nil)
    return unless new_value
    if self.persisted?
      goals.create(:value => new_value)
    elsif goal.is_a? NullGoal
      goals.build(:value => new_value)
    else
      g = goals.order("created_at DESC").first
      g.value = new_value
    end
  end
end

