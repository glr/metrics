Rails.application.routes.draw do
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  post "/graphql", to: "graphql#execute"
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      get 'metrics', to: 'metrics#index'
      get 'metrics/epics', to: 'metrics#epics'
      get 'metrics/:id', to: 'metrics#show'
      get 'teams', to: 'teams#index'
      get 'bugs/:id', to: 'metrics#bugs'
    end
  end
end
