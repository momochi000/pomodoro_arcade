class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :configure_permitted_parameters, :if => :devise_controller?

  def logged_in?
    current_user.present?
  end

  private

  def authorize_user
    unless logged_in?
      flash[:alert] = "You must be logged in to do that"
      return redirect_to new_user_session_path
    end
  end

  def configure_permitted_parameters
  end
end
