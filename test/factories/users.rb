# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :user do
  end

  factory :user_with_password, :parent => :user do
    password 'foo'
    password_confirmation 'foo'
  end
end
