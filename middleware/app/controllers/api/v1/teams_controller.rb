module Api
    module V1
        class TeamsController < ActionController::API
            def index
                render json:Team.last(10).as_json, status: 200
            end 
        end
    end
end
