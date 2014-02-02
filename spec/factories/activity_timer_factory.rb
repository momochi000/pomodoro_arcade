FactoryGirl.define do
  factory :activity_timer do
    title { Faker::Lorem.word }
    time { (rand() * 45).floor}
    break_time { (rand() * 15).floor}
  end

  factory :timer_with_goal, :parent => :activity_timer do
    goal {(rand() * 8).floor}
  end
end
