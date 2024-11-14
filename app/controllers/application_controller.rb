class ApplicationController < ActionController::Base
  helper_method :current_user, :logged_in?

  def authenticate_user
    unless logged_in?
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def logged_in?
    current_user.present?
  end
end
