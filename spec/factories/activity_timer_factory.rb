FactoryGirl.define do
  factory :activity_timer do
    title { Faker::Lorem.word }
    time { (rand() * 45).floor}
    break_time { (rand() * 15).floor}
  end
end
