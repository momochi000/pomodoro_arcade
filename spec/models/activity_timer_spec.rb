require 'spec_helper'

describe ActivityTimer do
  context "with a valid timer" do
    let(:timer) { FactoryGirl.create(:activity_timer) }
    describe "#to_backbone" do
      it "should return a json" do
        timer.to_backbone.should be_a String
      end

      it "should be of correct structure" do
        timer.to_backbone.should == {
          :title                  => timer.title,
          :timer_length_minutes   => timer.time,
          :rest_period_minutes    => timer.break_time
        }.to_json
      end
    end

    describe "#from_backbone" do
      context "with valid params" do
        let(:valid_params) { {"title"=>"Pomodoro", "timer_length_minutes"=>23, "timer_length"=>1380000, "time_interval"=>1000, "rest_period_minutes"=>4, "rest_period_length"=>240000, "state"=>"paused", "name"=>"test", "remaining_time"=>1380000} } 

        context "with a new timer" do
          let(:new_timer) { ActivityTimer.new }

          it "should set the timer's attributes" do
            new_timer.from_backbone(valid_params)
            new_timer.title.should == valid_params["title"]
            new_timer.time.should == valid_params["timer_length_minutes"]
            new_timer.break_time.should == valid_params["rest_period_minutes"]
          end
        end

        context "with an existing timer" do
          it "should set the timer's attributes" do
            timer.from_backbone(valid_params)
            timer.title.should == valid_params["title"]
            timer.time.should == valid_params["timer_length_minutes"]
            timer.break_time.should == valid_params["rest_period_minutes"]
          end
        end
      end
    end
  end
end
