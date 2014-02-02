require 'spec_helper'

module TimersControllerSpecHelper
  
end

# TODO: fill these out
describe TimersController do
  context "with a logged in user" do
    let(:user) { FactoryGirl.create(:user) }
    before { sign_in user }
    describe "#index" do
      context "with no timers attached to the user" do
        it "should assign an empty json as the timer collection" do
          get :index
          assigns(:backbone_timer_collection).should == [].to_json
        end
      end

      context "with a timer attached to the user" do
        let!(:timer) { FactoryGirl.create(:activity_timer, :user => user) }
        it "should load the users timers formatted for backbone" do
          get :index
          assigns(:backbone_timer_collection).should == [timer.to_backbone].to_json
        end
      end
    end

    describe "#create" do
    end

    describe "#destroy" do
      context "with a timer attached to the user" do
        let!(:timer) { FactoryGirl.create(:activity_timer, :user => user) }
        it "should destroy the given timer" do
          expect {
            xhr :delete, :destroy, {:id => timer.id}
          }.to change(user.timers, :count).by(-1)
        end
      end
    end
    describe "#started" do
    end
    describe "#completed" do
    end
    describe "#rest_completed" do
    end
  end
end
