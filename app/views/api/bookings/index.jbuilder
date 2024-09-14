json.bookings do
  json.array! @booking do |booking|
    json.id booking.id
    json.start_date booking.start_date
    json.end_date booking.end_date
  end
end