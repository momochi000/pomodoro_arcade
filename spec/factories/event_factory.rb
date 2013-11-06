FactoryGirl.define do
  factory :event do
  end

  factory :completed_timer, :class => Event::Timer::UserCompletedTimer do
    association :target, :factory => :activity_timer
  end

  factory :started_timer, :class => Event::Timer::UserStartedTimer do
    association :target, :factory => :activity_timer
  end

  factory :rest_completed_timer, :class => Event::Timer::UserCompletedRestPeriod do
    association :target, :factory => :activity_timer
  end
end


