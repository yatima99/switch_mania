Rails.application.routes.draw do
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      resources :tags, only: [:index]

      mount_devise_token_auth_for "User", at: "auth"

      namespace :current do
        resource :user, only: [:show, :update]
        resources :posts do
          resource :likes, only: [:create]
          resources :comments, only: [:create, :destroy]
        end

        get "liked_posts", to: "posts#liked_posts"
        get "recommended_posts", to: "posts#recommended_posts"

        resources :likes, only: [:destroy]
      end
      resources :posts, only: [:index, :show]
    end
  end
end
