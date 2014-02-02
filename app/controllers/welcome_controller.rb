class WelcomeController < ApplicationController
  def index
    redirect_to timers_path if logged_in?
  end
end
