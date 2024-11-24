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
        Rails.logger.error("Property creation failed: #{@property.errors.full_messages}")
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
      Rails.logger.info("AWS Bucket Name: #{ENV['PHOTO_UPLOAD_BUCKET']}")
      
      if params[:image].present?
        begin
          s3 = Aws::S3::Resource.new
          bucket_name = ENV['PHOTO_UPLOAD_BUCKET']
          raise "Bucket name not set" if bucket_name.blank?
    
          obj = s3.bucket(bucket_name).object("properties/#{SecureRandom.uuid}/#{params[:image].original_filename}")
          obj.upload_file(params[:image].path)
    
          render json: { image_url: obj.public_url }, status: :ok
        rescue Aws::S3::Errors::ServiceError => e
          Rails.logger.error("S3 upload failed: #{e.message}")
          render json: { error: "Failed to upload image: #{e.message}" }, status: :internal_server_error
        rescue StandardError => e
          Rails.logger.error("Error: #{e.message}")
          render json: { error: "An error occurred: #{e.message}" }, status: :internal_server_error
        end
      else
        Rails.logger.debug("No image parameter provided.")
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
