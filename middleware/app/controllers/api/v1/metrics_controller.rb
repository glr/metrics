require 'httparty'
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

            def self.jira(team_selection)
              
              # TODO: this is to make it easy to specify a team... probably a better way to do this
              team_id = {
                "scmdgn" => 1,
                "sdm" => 2,
              }[team_selection]
              
              # which team is this for?
              team = Team.find(team_id)
              
              # what was the last sprint we saved?
              last_sprint = Metrics::Sprint.where(team_id: team_id).order(:created_at).last()
              
              # 
              # Retrive data from Jira
              # code goes here
              # 1. retrieve the last few closed sprints, ~6 or so
              ## need to move the auth token to env vars and update to send them via docker env. ($JIRA, $JIRAURL)
              # jira returns 50 at a time by default, you can set pagination size with maxResults, and will need to figure out paging using some startAt + maxResults looping logic
              qurl = 'https://sparefoot.atlassian.net/rest/agile/latest/board/221/sprint?state=closed'
              response = HTTParty.get(qurl, {
                headers: {"Authorization" => "Basic Z2FicmllbC5yYWVsQHN0b3JhYmxlLmNvbTplSm9NZ2dHU2QzU3kzR2U2cmRTZDhEMjU="}
              })
              sprints = JSON.parse(response.body).with_indifferent_access[:values].last(6) # , response.code #, response.message, response.headers.inspect
              
              # 2. find the last completed sprint id
              # 3. check to see if it's the same as the one we've already saved
              #    a. if yes, do nothing
              #    b. if no, then add the jira sprint id to the list of things we need to update, then do 
              #       the same with the one before, repeating until we find the last sprint we've not saved
              #
              updates = []
              sprints.reverse.each do |x|
                # p x[:name], x[:id]
                if last_sprint == nil || x[:id] == last_sprint.jid
                  updates.push x[:id]
                end
              end
              
              
              # 4. for each of the sprints we need to save, 
              #    a. retrieve the data from jira
              #    b. create sprint with the response
              # reponse = ...
              #
              # t.string "name"
              # t.text "goal"
              # t.float "scope_change_pct"
              # t.float "forecast_error_pct"
              # t.float "story_pct"
              # t.float "spike_pct"
              # t.float "bug_pct"
              # t.float "data_fix_pct"
              # t.float "operational_work_pct"
              # t.float "incident_pct"
              # t.float "technical_debt_pct"
              # t.bigint "team_id", null: false
              # t.integer "jid"
              
              updates.each do |x|
                # scope change %
                # https://sparefoot.atlassian.net/rest/greenhopper/1.0/gadgets/sprints/health?rapidViewId=221&sprintId=905
                #
                # sprint metrics
                # https://sparefoot.atlassian.net/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=221&sprintId=905
                # 
                qurl = ''
                response = HTTParty.get(qurl, {
                  headers: {"Authorization" => "Basic Z2FicmllbC5yYWVsQHN0b3JhYmxlLmNvbTplSm9NZ2dHU2QzU3kzR2U2cmRTZDhEMjU="}
                })
                sprint = Metrics::Sprint.new()
                p sprint
              end 

            end
        end
    end
end