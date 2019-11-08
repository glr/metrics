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

      def epics
        data = {
          wip: {
            bigRocks:[],
            other:[]
          },
          todo: {
            bigRocks:[],
            other:[]},
          dates: [],
          todoBars: [],
          wipBars: [],
          wipCountBars:[]
        }

        Metrics::Epic.last(6).each { |d|
          data[:wip][:bigRocks].push d.wip_bigrocks
          data[:todo][:bigRocks].push d.todo_bigrocks
          data[:wip][:other].push d.wip_other
          data[:todo][:other].push d.todo_other
          data[:dates].push d.report_period
          wipTotal = d.wip_bigrocks + d.wip_other
          todoTotal = d.todo_bigrocks + d.todo_other
          data[:todoBars].push({
            "Big Rocks" => d.todo_bigrocks.to_f/todoTotal * 100,
            "Other" => d.todo_other.to_f/todoTotal * 100
          })
          data[:wipBars].push({
            "Big Rocks" => d.wip_bigrocks.to_f/wipTotal * 100,
            "Other" => d.wip_other.to_f/wipTotal * 100
          })
          data[:wipCountBars].push({
            "Big Rocks" => d.wip_bigrocks,
            "Other" => d.wip_other
          })
        }

        render json:data, status:200
      end

      def t3
        render json:Metrics::T3.order(:created_at).last(6), status:200
      end
    end
  end
end