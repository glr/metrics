require 'jira_data_importer'

namespace :storable do
    desc "Retrieve Storable NC metrics from Jira"
    task :retrieveMetrics do
        JiraDataImporter::metricsRetrieve()
    end

    desc "Retrieve Storable NC scrum team metrics from Jira"
    task :retrieveTeamMetrics do
        JiraDataImporter::teamMetricsRetrieve()
    end

    desc "Retrieve Storable NC epic metrics from Jira"
    task :retrieveEpicMetrics do
        JiraDataImporter::epicMetricsRetrieve()
    end

    desc "Retrieve Storable NC T3 metrics from Jira"
    task :retrieveT3Metrics do
       JiraDataImporter::t3Retrieve() 
    end
end
