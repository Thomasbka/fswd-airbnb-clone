module Api
  class BookingsController < ApplicationController
    def create
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized if !session

      property = Property.find_by(id: params[:booking][:property_id])
      return render json: { error: 'cannot find property' }, status: :not_found if !property

      begin
        @booking = Booking.create({ user_id: session.user.id, property_id: property.id, start_date: params[:booking][:start_date], end_date: params[:booking][:end_date]})
        render 'api/bookings/create', status: :created
      rescue ArgumentError => e
        render json: { error: e.message }, status: :bad_request
      end
    end

    def get_property_bookings
      property = Property.find_by(id: params[:id])
      return render json: { error: 'cannot find property' }, status: :not_found if !property

      @bookings = property.bookings.where("end_date > ? ", Date.today)
      render 'api/bookings/index'
    end

    def index
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized unless session
      
      @bookings = session.user.bookings.includes(:property, :charges)
      render json: {
        bookings: @bookings.map do |booking|
          {
            id: booking.id,
            start_date: booking.start_date,
            end_date: booking.end_date,
            property: {
              id: booking.property.it,
              title: booking.property.title,
              city: booking.property.city,
              coutry: booking.propety.country,
              price_per_night: booking.propety.price_per_night,
            },
            is_paid: booking.is_paid?
          }
        end
      }, status: :ok
    end

    private

    def booking_params
      params.require(:booking).permit(:property_id, :start_date, :end_date)
    end
  end
end