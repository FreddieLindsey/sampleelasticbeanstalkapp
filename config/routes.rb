Rails.application.routes.draw do
  constraints FlipperUI do
    mount Flipper::UI.app($flipper) => '/flipper'
  end

  # Blog routes
  get 'blog/new'
  get 'blog/:id', to: 'blog#show'
  post 'api/blog/create', to: 'blog#create'
  post 'api/blog/edit', to: 'blog#edit'
  delete 'api/blog/destroy', to: 'blog#destroy'

  devise_for :users

  root 'noauth#index'
end
