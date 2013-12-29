require 'spec_helper'

describe ActivityTimer do
  context "with a valid timer" do
    let(:timer) { FactoryGirl.create(:activity_timer) }

    describe "relationships" do
      describe "has_many completed_events" do
        it "should return a set of completed_events" do
          timer.completed_events.should == []
          event = FactoryGirl.create(:completed_timer, :target => timer)
          timer.reload.completed_events.should == [event]
        end
      end
      describe "has_many started_events" do
        it "should return a set of started_events" do
          timer.started_events.should == []
          event = FactoryGirl.create(:started_timer, :target => timer)
          timer.reload.started_events.should == [event]
        end
      end
      describe "has_many rest_completed_events" do
        it "should return a set of rest_completed_events" do
          timer.rest_completed_events.should == []
          event = FactoryGirl.create(:rest_completed_timer, :target => timer)
          timer.reload.rest_completed_events.should == [event]
        end
      end
    end

    describe "instance methods" do
      describe "#to_backbone" do
        it "should return a json" do
          timer.to_backbone.should be_a Hash
        end

        it "should be of correct structure" do
          timer.to_backbone.should == {
            'id'                     => timer.id.to_s,
            'goal'                   => timer.goal.value,
            'title'                  => timer.title,
            'timer_length_minutes'   => timer.time.to_s,
            'rest_period_minutes'    => timer.break_time.to_s
          }
        end

        context "with a goal" do
          let(:goal_value) { 3 }
          before { timer.goal = goal_value }
          it "should be of correct structure" do
            timer.to_backbone.should == {
              'id'                     => timer.id.to_s,
              'goal'                   => goal_value,
              'title'                  => timer.title,
              'timer_length_minutes'   => timer.time.to_s,
              'rest_period_minutes'    => timer.break_time.to_s
            }
          end
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

      describe "#goal" do
        context "when no goals are attached" do
          before do
            timer.goals.destroy_all
          end
          it "should return a null goal" do
            timer.goal.should be_a NullGoal
          end
        end

        context "with only a single goal attached" do
          let!(:goal) { FactoryGirl.create(:goal, :activity_timer => timer)}
          it "should return the goal" do
            timer.goal.should == goal
          end
        end

        context "with multiple goals attached" do
          let!(:goal) { FactoryGirl.create(:goal, :activity_timer => timer, :created_at => Time.now-3.days)}
          let!(:goal2) { FactoryGirl.create(:goal, :activity_timer => timer, :created_at => Time.now-5.days)}

          it "should return the latest goal" do
            timer.goal.should == goal
          end
        end
      end

      describe "#goal=" do
        context "with an unsaved timer" do
          let(:new_timer) { FactoryGirl.build(:activity_timer) }
          let(:new_goal_value) { 30 }

          it "should set the goal for the timer" do
            new_timer.goal = new_goal_value
            new_timer.goal.value.should == new_goal_value
          end

          it "should not create a new goal" do
            expect {
              new_timer.goal = new_goal_value
            }.not_to change(Goal, :count)
          end

          context "when the timer is then saved" do
            before do
              new_timer.goal = new_goal_value
            end

            it "should save the goal" do
              expect {
                new_timer.save
              }.to change(Goal, :count).by(1)
            end
          end
        end

        context "when the timer is persisted" do
          let(:new_goal_value) { 30 }
          
          it "should set the goal for the timer" do
            timer.goal = new_goal_value
            timer.goal.value.should == new_goal_value
          end

          it "should create a new goal" do
            expect {
              timer.goal= new_goal_value
            }.to change(Goal, :count).by(1)
          end
        end
      end
    end
  end
end
