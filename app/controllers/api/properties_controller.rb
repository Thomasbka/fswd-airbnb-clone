module Api
  class PropertiesController < ApplicationController
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

    private

    def property_params
      params.require(:property).permit(:title, :description, :price_per_night, :image_url)
    end
  end
end