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
                if last_sprint == nil || x[:id] != last_sprint.jid
                  updates.push x[:id]
                elsif last_sprint.jid == x[:id]
                  break
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

              tjid = team.jid.to_s
              updates.each do |x|
                types = {
                  "Story"=>nil,
                  "Spike"=>nil,
                  "Bug"=>nil,
                  "Data Fix"=>nil,
                  "Operational Work"=>nil,
                  "Incident"=>nil,
                  "Technical Debt"=>nil
                }

                sid = x.to_s
                sprint = Metrics::Sprint.new()
                sprint.jid = sid
                sprint.team_id = tjid

                # scope change %
                qurl = 'https://sparefoot.atlassian.net/rest/greenhopper/1.0/gadgets/sprints/health?rapidViewId=' + tjid + '&sprintId=' + sid
                response = HTTParty.get(qurl, {
                  headers: {"Authorization" => "Basic Z2FicmllbC5yYWVsQHN0b3JhYmxlLmNvbTplSm9NZ2dHU2QzU3kzR2U2cmRTZDhEMjU="}
                })
                sprint.scope_change_pct = (JSON.parse(response.body).with_indifferent_access[:sprintMetrics].last()["value"].to_f - 100) / 100 # , response.code 
                
                # sprint metrics
                qurl = 'https://sparefoot.atlassian.net/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=' + tjid + '&sprintId=' + sid
                response = HTTParty.get(qurl, {
                  headers: {"Authorization" => "Basic Z2FicmllbC5yYWVsQHN0b3JhYmxlLmNvbTplSm9NZ2dHU2QzU3kzR2U2cmRTZDhEMjU="}
                })
                sprint_data = JSON.parse(response.body).with_indifferent_access
                sprint_metrics = sprint_data[:contents]
                total_initial = (sprint_metrics["completedIssuesInitialEstimateSum"]["value"] || 0.0) + 
                  (sprint_metrics["issuesNotCompletedInitialEstimateSum"]["value"] || 0.0) + 
                  (sprint_metrics["puntedIssuesInitialEstimateSum"]["value"] || 0.0)
                total_complete = (sprint_metrics["completedIssuesEstimateSum"]["value"] || 0.0)
                forecast_error = total_initial - total_complete
                sprint.forecast_error_pct = (total_complete == 0.0) ? 0.0 : forecast_error/total_complete
                sprint.goal = sprint_data[:sprint][:goal]
                sprint.name = sprint_data[:sprint][:name]

                # issue type counts, iterate over issueTypes to get counts
                types.each do |t, v|
                  qurl = 'https://sparefoot.atlassian.net/rest/agile/latest/board/' + tjid + '/sprint/' + sid + '/issue?fields=none&jql=issuetype="' + URI.escape(t) + '"'
                  response = HTTParty.get(qurl, {
                    headers: {"Authorization" => "Basic Z2FicmllbC5yYWVsQHN0b3JhYmxlLmNvbTplSm9NZ2dHU2QzU3kzR2U2cmRTZDhEMjU="}
                  })
                  types[t] = JSON.parse(response.body).with_indifferent_access[:total].to_f 
                end
                total_count = types.values.reduce { |sum, i| sum + (i == nil ? 0 : i) }
                sprint.story_pct = types["Story"]/ total_count
                sprint.spike_pct = types["Spike"]/total_count
                sprint.bug_pct = types["Bug"]/total_count
                sprint.data_fix_pct = types["Data Fix"]/total_count
                sprint.operational_work_pct = types["Operational Work"]/total_count
                sprint.incident_pct = types["Incident"]/total_count
                sprint.technical_debt_pct = types["Technical Debt"]/total_count
                
                p sprint
                # sprint.save()
              end 
            end
        end
    end
end