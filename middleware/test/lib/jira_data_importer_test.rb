require 'test_helper'
require 'jira_data_importer'

class JiraDataImporterTest < ActiveSupport::TestCase
    test "T3 " do
        body = '{
            "expand": "schema,names",
            "startAt": 0,
            "maxResults": 50,
            "total": 33,
            "issues": [
                {
                    "expand": "operations,versionedRepresentations,editmeta,changelog,renderedFields",
                    "id": "79609",
                    "self": "https://sparefoot.atlassian.net/rest/api/latest/issue/79609",
                    "key": "T3-425",
                    "fields": {
                        "issuetype": {
                            "self": "https://sparefoot.atlassian.net/rest/api/2/issuetype/10001",
                            "id": "10001",
                            "description": "A user story. Created by JIRA Software - do not edit or delete.",
                            "iconUrl": "https://sparefoot.atlassian.net/secure/viewavatar?size=medium&avatarId=10815&avatarType=issuetype",
                            "name": "Story",
                            "subtask": false,
                            "avatarId": 10815
                        },
                        "labels": [
                            "postconversion"
                        ]
                    }
                }]}'
        uri_template = Addressable::Template.new "https://sparefoot.atlassian.net/rest/api/latest/search?fields=labels,issuetype,key&jql=project=T3%20AND%20type%20not%20in%20(epic)%20AND%20status%20in%20(resolved,%20closed,%20done)%20and%20resolved%3E={startDate}%20AND%20resolved%3C={endDate}"
        stub_request(:get, uri_template).
        to_return(status: 200, body: body, headers: {})
        qurl = "https://sparefoot.atlassian.net/rest/api/latest/search?fields=labels,issuetype,key&jql=project=T3%20AND%20type%20not%20in%20(epic)%20AND%20status%20in%20(resolved,%20closed,%20done)%20and%20resolved%3E=2019-10-30%20AND%20resolved%3C=2019-11-12"
        JiraDataImporter::jiraQuery(qurl)
    end

    test "outcomeMetricsRetrieve makes Jira query" do
        skip 'This is not ready yet, needs to be refactored to use instance, instead of static calls in rake task'
        JiraDataImporter.stub :jiraQuery, true do 
            assert_nothing_raised {
                JiraDataImporter.outcomeMetricsRetrieve()
            }
        end
    end
end