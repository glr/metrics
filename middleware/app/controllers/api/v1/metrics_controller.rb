# require 'jira_data_importer'
module Api
  module V1
    class MetricsController < ActionController::API
      SPRINTS_TO_SHOW = 7
      
      def index
          render json:Metrics::Sprint.order(:created_at).last(12).as_json, status: 200
      end

      def show
        obj = Metrics::Sprint.where(team_id: params[:id]).order(:created_at).last(SPRINTS_TO_SHOW).as_json
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

        Metrics::Epic.last(SPRINTS_TO_SHOW).each { |d|
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

      def bugs
        # # SDM: 26076(B/DF/I), 25890(all), and cf[10300] = "Scrumdog Millionaire" 
        # # SCMDGN: 26077(B/DF/I), 25885(all), and cf[10300] = "Scrumudgeons"
        # # SLT: 26104
        # # SL: 26057
        # team = {
        #   '1' => 'Scrumudgeons',
        #   '2' => '"Scrumdog Millionaire"'
        # }
        # qurl = ENV['JURL'] + '/rest/gadget/1.0/dateCountInPeriod?jql=filter=26057 and cf[10300]=' + team[params[:id]] + '&period=weekly&daysprevious=60&operation=cumulative&field=created&field=resolved&field=unresolvedTrend&includeVersions=false'
        
        # # we'll want to cache this, probably
        # response = JiraDataImporter.jiraQuery(qurl)
        
        # data = []
        # response[:results].each { |d|
        #   date = Date.strptime((d[:data][:resolved][:searchUrl]).match(/\+%3C\+(.*)/)[1], '%Y-%m-%d')
        #   if date<=Date.today() 
        #     data.push(
        #       {
        #         'created' => d[:data][:created][:count],
        #         'resolved' => d[:data][:resolved][:count],
        #         'trend' => d[:data][:unresolvedTrend][:count],
        #         'date' => date
        #       }
        #     )
        #   end
        # }
        data = [{test: "test"}]
        render json:data, status:200
      end
    end
  end
end