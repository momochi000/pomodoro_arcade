class TimersController < ApplicationController
  before_filter :authenticate_user!

  def index
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
