module Api
    module V1
        class MetricsController < ActionController::API
            def index
                render json:Metrics::Sprint.order(:created_at).last(12).as_json, status: 200
            end

            def show
              obj = Metrics::Sprint.where(team_id: params[:id]).order(:created_at).last(6).as_json
              render json:obj, status:200
            end
        end
    end
end