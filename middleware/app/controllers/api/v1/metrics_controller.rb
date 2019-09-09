module Api
    module V1
        class MetricsController < ActionController::API
            def index
                obj = {
                    name:"Scrumudgeons",
                    sprint:{
                      id:2119,
                      name:"SCMDGN Sprint 2119",
                      goals:"This is a fake goal. So is this.",
                      accuracy:0.78,
                      change:0,
                      forecast:24,
                      actual:27
                    }
                  }
                render json: obj, status: 200
            end

            def history
                obj = [
                    {
                      forecast:20,
                      actual:14,
                      accuracy:0.7,
                      change:0.01
                    },
                    {
                      forecast:14,
                      actual:16,
                      accuracy:0.87,
                      change:0
                    },
                    {
                      forecast:16,
                      actual:15,
                      accuracy:0.94,
                      change:0
                    },
                    {
                      forecast:15,
                      actual:15,
                      accuracy:1,
                      change:0
                    },
                    {
                      forecast:15,
                      actual:16,
                      accuracy:0.94,
                      change:0.01
                    },
                    {accuracy:0.78,
                    change:0,
                    forecast:24,
                    actual:27}
                  ]
                render json: obj, status: 200
            end
        end
    end
end