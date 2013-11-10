class TimersController < ApplicationController
  before_filter :authenticate_user!
  before_filter :load_timer, :except => [:index, :create]

  def index
    @backbone_timer_collection = current_user.activity_timers.map(&:to_backbone).to_json
  end

  def create
    @new_timer = ActivityTimer.create_from_backbone(params[:timer], current_user)

    respond_to do |format|
      format.json do
        render :json => @new_timer.to_backbone
      end
    end
  end

  def destroy
    respond_to do |format|
      format.json do
      end
    end
  end

  def started
    @timer.started
    respond_to do |format|
      format.json { render :nothing => true}
    end
  end

  def completed
    @timer.completed
    respond_to do |format|
      format.json { render :nothing => true}
    end
  end

  def rest_completed
    @timer.rest_completed
    respond_to do |format|
      format.json { render :nothing => true}
    end
  end

  private

  def load_timer
    @timer = ActivityTimer.find(params[:id] || params[:timer_id])
  end
end
