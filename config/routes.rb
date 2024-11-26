Rails.application.routes.draw do
  root to: 'static_pages#home'

  get '/property/:id' => 'static_pages#property'
  get '/properties/new' => 'static_pages#new'
  get '/login' => 'static_pages#login'
  get '/bookings' => 'static_pages#bookings'
  get '/booking/:id/success' => 'static_pages#booking_success'

  namespace :api do
    resources :users, only: [:create]
    resources :sessions, only: [:create] do
      collection do
        delete :destroy
      end
    end
    resources :properties, only: [:index, :show, :create, :update] do
      collection do
        post :upload_image
      end
    end
    resources :bookings, only: [:index, :create, :show]
    resources :charges, only: [:create]

    get '/properties/:id/bookings' => 'bookings#get_property_bookings'
    get '/authenticated' => 'sessions#authenticated'

    post '/charges/mark_complete' => 'charges#mark_complete'

    get '/current_user' => 'users#current_user'
  end

  get '*path', to: 'static_pages#home', constraints: ->(req) { !req.xhr? && req.format.html? }
end
