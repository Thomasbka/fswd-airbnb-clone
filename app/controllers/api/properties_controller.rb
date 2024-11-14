module Api
  class PropertiesController < ApplicationController
    before_action :authenticate_user, only: [:create, :update]

    def index
      @properties = Property.order(created_at: :desc).page(params[:page]).per(6)
      return render json: { error: 'not_found' }, status: :not_found if !@properties

      render 'api/properties/index', status: :ok
    end

    def show
      @property = Property.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found if !@property

      render 'api/properties/show', status: :ok
    end

    def update
      @property = Property.find(params[:id])

      if @property.update(property_params)
        render json: { property: @property, message: 'Property updated successfully' }, status: :ok
      else
        render json: { errors: @property.errors.full_messages }, status: :unprocessable_entity
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

    def upload_image
      if params[:image].present?
        s3 = Aws::S3::Resource.new

        obj = s3.bucket(ENV['S3_BUCKET_NAME']).object("properties/#{SecureRandom.uuid}/#{params[:image].original_filename}")

        obj.upload_file(params[:image].path, acl: 'public-read')

        render json: { image_url: obj.public_url }, status: :ok
      else
        render json: { error: 'No image provided' }, status: :unprocessable_entity
      end
    end

    private

    def property_params
      params.require(:property).permit(:title, :description, :city, :country, :property_type, :price_per_night, :max_guests, :bedrooms, :beds, :baths, :image)
    end
  end
end