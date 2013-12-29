class User < ActiveRecord::Base
  has_many :activity_timers
  has_many :completed_events, :through => :activity_timers
  has_many :goals, :through => :activity_timers
  has_one :user_profile

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model #DEPRECATED for rails 4
  #attr_accessible :email, :password, :password_confirmation, :remember_me

  def completed_pomodoros #Alias for completed_events relation
    completed_events
  end

  def timers #Alias for activity_timers relation
    activity_timers
  end
end
