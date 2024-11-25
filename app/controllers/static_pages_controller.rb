class StaticPagesController < ApplicationController
  def home
    render 'home'
  end

  def property
    @property = Property.find(params[:id])
    @data = { property_id: @property.id }.to_json
    render :property
  end

  def login
    render 'login'
  end

  def new
    render 'createProperty'
  end

  def bookings
  end
end