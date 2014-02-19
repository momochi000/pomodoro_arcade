module Progress
  class BaseController < ApplicationController
    before_filter :authorize_user
  end
end
