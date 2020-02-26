require 'jira_data_importer'

namespace :storable do
    desc "Retrieve all Storable NC metrics from Jira"
    task :retrieveAllMetrics => :environment do
        JiraDataImporter.metricsRetrieve()
    end

    desc "Retrieve Storable NC scrum team metrics from Jira"
    task :retrieveTeamMetrics => :environment do
        JiraDataImporter.teamMetricsRetrieve()
    end

    desc "Retrieve Storable NC epic metrics from Jira"
    task :retrieveEpicMetrics => :environment do
        JiraDataImporter.epicMetricsRetrieve()
    end

    desc "Retrieve Storable NC Big Rock Story metrics from Jira"
    task :retrieveBigRockMetrics => :environment do
        JiraDataImporter.storyBRMetricsRetrieve()
    end

    desc "Retrieve Storable NC T3 metrics from Jira"
    task :retrieveT3Metrics => :environment do
        JiraDataImporter.t3Retrieve() 
    end
end
