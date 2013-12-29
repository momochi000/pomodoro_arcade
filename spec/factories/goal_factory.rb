FactoryGirl.define do
  factory :goal do
    value {(rand() * 12 + 2).floor}
  end
end
