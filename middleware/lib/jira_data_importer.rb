class JiraDataImporter
  @@baseUrl = ENV['JURL']
  @@auth = ENV['JAUTH']

  def self.teamMetricsRetrieve
    jiraRetrieve('scmdgn')
    jiraRetrieve('sdm')
  end

  def self.epicMetricsRetrieve
    baseString = @@baseUrl + '/rest/api/latest/search?jql=project=SL and type=epic and status='

    otherInProgressUrl = baseString + '"In Progress" and (labels not in (st_big_rock) or labels is empty)'
    bigrockInProgressUrl = baseString + '"In Progress" and (labels in (st_big_rock))'
    otherToDoURL = baseString + '"To Do" and (labels not in (st_big_rock) or labels is empty)'
    bigrockToDoUrl = baseString + '"To Do" and (labels in (st_big_rock))'

    lastDate = Metrics::Epic.last[:report_period]
    if Date.today > Date.parse(lastDate)
      bigRockWIP = jiraQuery(bigrockInProgressUrl)[:total]
      otherWIP = jiraQuery(otherInProgressUrl)[:total]
      bigrockToDo = jiraQuery(bigrockToDoUrl)[:total]
      otherToDo = jiraQuery(otherToDoURL)[:total]
      report_period = Date.today.strftime('%B %-d, %Y')
      Metrics::Epic.create(
        wip_bigrocks: bigRockWIP,
        wip_other: otherWIP,
        todo_bigrocks: bigrockToDo,
        todo_other: otherToDo,
        report_period: report_period
      )
    else
      puts 'Epic Report for ' + Date.today.strftime('%B %-d, %Y') + ' already saved.'
    end
  end

  def self.outcomeMetricsRetrieve
    jiraQuery(@@baseUrl)
  end

  def self.weightedSprintMetricsRetrieve
    jiraQuery(@@baseUrl)
  end

  def self.storyBRMetricsRetrieve
    baseString = @@baseUrl + '/rest/api/latest/search?jql=project=SL and type!=epic and status='

    otherInProgressUrl = baseString + '"In Progress" and (labels not in (st_big_rock) or labels is empty)'
    bigrockInProgressUrl = baseString + '"In Progress" and (labels in (st_big_rock))'

    lastDate = Metrics::StoryBr.last[:report_period]
    if Date.today > Date.parse(lastDate)
      bigRockWIP = jiraQuery(bigrockInProgressUrl)[:total]
      otherWIP = jiraQuery(otherInProgressUrl)[:total]
      report_period = Date.today.strftime('%B %-d, %Y')
      Metrics::StoryBr.create(
        bigrocks: bigRockWIP,
        other: otherWIP,
        report_period: report_period
      )
    else
      puts 'Story Report for ' + Date.today.strftime('%B %-d, %Y') + ' already saved.'
    end
  end

  def self.metricsRetrieve
    teamMetricsRetrieve
    epicMetricsRetrieve
  end

  def self.jiraRetrieve(team_selection)
    # TODO: this is to make it easy to specify a team... probably a better way to do this
    team_id = {
      'scmdgn' => 1,
      'sdm' => 2
    }[team_selection]

    # which team is this for?
    team = Team.find(team_id)
    tjid = team.jid.to_s

    # what was the last sprint we saved?
    last_sprint = Metrics::Sprint.where(team_id: team_id).order(:created_at).last

    #
    # Retrive data from Jira
    # code goes here
    # 1. retrieve the last few closed sprints, ~6 or so
    # jira returns 50 at a time by default, you can set pagination size with maxResults,
    # and will need to figure out paging using some startAt + maxResults looping logic
    qurl = "#{@@baseUrl}/rest/agile/latest/board/#{tjid}/sprint?state=closed&startAt=25"
    sprints = jiraQuery(qurl)[:values].last(6)

    # 2. find the last completed sprint id
    # 3. check to see if it's the same as the one we've already saved
    #    a. if yes, do nothing
    #    b. if no, then add the jira sprint id to the list of things we need to update, then do
    #       the same with the one before, repeating until we find the last sprint we've not saved
    #
    updates = []
    sprints.reverse.each do |x|
      if x[:originBoardId] == tjid.to_i
        if last_sprint.nil? || x[:id] != last_sprint.jid
          updates.push x[:id]
        elsif last_sprint.jid == x[:id]
          break
        end
      end
    end

    # 4. for each of the sprints we need to save,
    #    a. retrieve the data from jira
    #    b. create sprint with the response
    # reponse = ...

    updates.reverse.each do |x|
      types = {
        'Story' => nil,
        'Spike' => nil,
        'Bug' => nil,
        'Data Fix' => nil,
        'Operational Work' => nil,
        'Incident' => nil,
        'Technical Debt' => nil
      }

      sid = x.to_s
      sprint = Metrics::Sprint.new
      sprint.jid = sid.to_i
      sprint.team_id = team_id.to_i

      # scope change %
      qurl = "#{@@baseUrl}/rest/greenhopper/1.0/gadgets/sprints/health?rapidViewId=#{tjid}&sprintId=#{sid}"
      sprint.scope_change_pct = ((jiraQuery(qurl)[:sprintMetrics].last['value'].to_f - 100) / 100)

      # sprint metrics
      qurl = "#{@@baseUrl}/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=#{tjid}&sprintId=#{sid}"
      sprint_data = jiraQuery(qurl)

      sprint_metrics = sprint_data[:contents]
      total_initial = (sprint_metrics['completedIssuesInitialEstimateSum']['value'] || 0.0) +
                      (sprint_metrics['issuesNotCompletedInitialEstimateSum']['value'] || 0.0) +
                      (sprint_metrics['puntedIssuesInitialEstimateSum']['value'] || 0.0)
      total_complete = (sprint_metrics['completedIssuesEstimateSum']['value'] || 0.0)
      forecast_error = (total_initial - total_complete)
      sprint.attainment = total_complete == 0.0 ? 0.0 : total_complete / total_initial
      sprint.forecast_error_pct = total_complete == 0.0 ? 0.0 : forecast_error.abs / total_complete
      sprint.goal = sprint_data[:sprint][:goal]
      sprint.name = sprint_data[:sprint][:name]

      # issue type counts, iterate over issueTypes to get counts
      types.each do |t, _v|
        qurl = "#{@@baseUrl}/rest/agile/latest/board/#{tjid}/sprint/#{sid}/issue?fields=none&jql=issuetype='#{URI.escape(t)}'"
        types[t] = jiraQuery(qurl)[:total].to_f
      end
      total_count = types.values.reduce { |sum, i| sum + (i.nil? ? 0 : i) }
      sprint.story_pct = types['Story'] / total_count
      sprint.spike_pct = types['Spike'] / total_count
      sprint.bug_pct = types['Bug'] / total_count
      sprint.data_fix_pct = types['Data Fix'] / total_count
      sprint.operational_work_pct = types['Operational Work'] / total_count
      sprint.incident_pct = types['Incident'] / total_count
      sprint.technical_debt_pct = types['Technical Debt'] / total_count
      p sprint.save
    end
  end

  def self.jiraQuery(qUrl)
    response = HTTParty.get(qUrl, {
                              headers: { 'Authorization' => "Basic #{@@auth}" }
                            })
    JSON.parse(response.body).with_indifferent_access
  end
end
