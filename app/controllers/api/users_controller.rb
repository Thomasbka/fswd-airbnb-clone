module Api
  class UsersController < ApplicationController
    def create
      @user = User.new(user_params)

      if @user.save
        render 'api/users/create', status: :created
      else
        render json: { success: false }, status: :bad_request
      end
    end

    def current_user
      if session[:user_id]
        user = User.find_by(id: session[:user_id])
        if user
          render json: { user: user }
        else
          render json: { error: "User not found" }, status: :not_found
        end
      else
        render json: { error: "Not logged in" }, status: :unauthorized
      end
    end

    private

    def find_current_user
      @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
    end

    def logged_in?
      session[:user_id].present?
    end

    def user_params
      params.require(:user).permit(:email, :password, :username)
    end
  end
end
