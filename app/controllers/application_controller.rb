class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :configure_permitted_parameters, :if => :devise_controller?

  def logged_in?
    current_user.present?
  end

  private

  def configure_permitted_parameters
  end
end
