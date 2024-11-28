module Api
  class PropertiesController < ApplicationController
    skip_before_action :verify_authenticity_token, only: [:create, :update]
    before_action :authenticate_user, only: [:create, :update]

    def index
      @properties = Property.order(created_at: :desc).page(params[:page]).per(6)
      if @properties.any?
        render 'api/properties/index', status: :ok
      else
        render json: { error: 'No properties found' }, status: :not_found
      end
    end

    def show
      @property = Property.find_by(id: params[:id])
      if @property
        render 'api/properties/show', status: :ok
      else
        render json: { error: 'Property not found' }, status: :not_found
      end
    end

    def update
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'unauthorized' }, status: :unauthorized unless session
    
      property = current_user.properties.find_by(id: params[:id])
      return render json: { error: 'not found' }, status: :not_found unless property
    
      property.image.attach(params[:property][:image]) if params[:property][:image].present?
    
      if property.update(property_params)
        @property = property
        render 'api/properties/show', status: :ok
      else
        render json: { error: property.errors.full_messages }, status: :unprocessable_entity
      end
    end
    

    def create
      @property = current_user.properties.new(property_params)
    
      if params[:property][:image].present?
        @property.image.attach(
          io: params[:property][:image],
          filename: params[:property][:image].original_filename,
          content_type: params[:property][:image].content_type,
          key: "properties/#{SecureRandom.uuid}/#{params[:property][:image].original_filename}"
        )
      end
    
      if @property.save
        render 'api/properties/show', status: :created
      else
        Rails.logger.error @property.errors.full_messages
        render json: { error: @property.errors.full_messages }, status: :unprocessable_entity
      end
    end
    
    
    

    private

    def authenticate_user
      unless current_user
        render json: { error: 'Unauthorized' }, status: :unauthorized
      end
    end

    def current_user
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      session&.user
    end

    def property_params
      params.require(:property).permit(
        :title,
        :description,
        :city,
        :country,
        :property_type,
        :price_per_night,
        :max_guests,
        :bedrooms,
        :beds,
        :baths,
        :image
      )
    end
  end
end
