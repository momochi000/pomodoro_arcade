class ApplicationController < ActionController::Base
  protect_from_forgery

  before_filter :configure_permitted_parameters, :if => :devise_controller?

  private

  def configure_permitted_parameters
  end
end
