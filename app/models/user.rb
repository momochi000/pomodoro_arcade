class User < ActiveRecord::Base
  has_many :activity_timers
  has_many :completed_pomodoros, :through => :activity_timers
  has_one :user_profile

  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model #DEPRECATED for rails 4
  #attr_accessible :email, :password, :password_confirmation, :remember_me

  def timers #Alias for activity_timers relation
    activity_timers
  end
end
