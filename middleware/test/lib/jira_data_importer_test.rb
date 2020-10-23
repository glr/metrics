require 'test_helper'
require 'jira_data_importer'

class JiraDataImporterTest < ActiveSupport::TestCase
    test "outcomeMetricsRetrieve makes Jira query" do
        skip 'This is not ready yet, needs to be refactored to use instance, instead of static calls in rake task'
        JiraDataImporter.stub :jiraQuery, true do 
            assert_nothing_raised {
                JiraDataImporter.outcomeMetricsRetrieve()
            }
        end
    end
end