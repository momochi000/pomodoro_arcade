class TimersController < ApplicationController
  before_filter :authenticate_user!

  def index
    @backbone_timer_collection = current_user.activity_timers.map(&:to_backbone)
  end

  def create
    respond_to do |format|
      format.json do
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
    respond_to do |format|
      format.json do
      end
    end
  end

  def completed
    respond_to do |format|
      format.json do
      end
    end
  end
end
