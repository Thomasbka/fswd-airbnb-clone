module Api
  class PropertiesController < ApplicationController
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

    def create
      @property = current_user.properties.build(property_params)
      if @property.save
        render json: { property: @property }, status: :created
      else
        render json: { errors: @property.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      @property = current_user.properties.find_by(id: params[:id])
      if @property && @property.update(property_params)
        render json: { property: @property, message: 'Property updated successfully' }, status: :ok
      else
        render json: { errors: @property ? @property.errors.full_messages : ['Property not found'] }, status: :unprocessable_entity
      end
    end

    def upload_image
      if params[:image].present?
        begin
          s3 = Aws::S3::Resource.new
          obj = s3.bucket(ENV['S3_BUCKET_NAME']).object("properties/#{SecureRandom.uuid}/#{params[:image].original_filename}")
          obj.upload_file(params[:image].path, acl: 'public-read')

          render json: { image_url: obj.public_url }, status: :ok
        rescue Aws::S3::Errors::ServiceError => e
          render json: { error: "Failed to upload image: #{e.message}" }, status: :internal_server_error
        end
      else
        render json: { error: 'No image provided' }, status: :unprocessable_entity
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
        :image_url
      )
    end
  end
end
