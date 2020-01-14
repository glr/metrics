require 'test_helper'
module Api
    module V1
        class MetricsTest < ActionDispatch::IntegrationTest
            test "should get index" do
                get '/api/v1/metrics'
                assert_response :success
            end

            test "should get metrics by a team id" do
                get '/api/v1/metrics/1'
                assert_response :success
            end

            test "should get t3 metrics" do
                get '/api/v1/metrics/t3'
                assert_response :success
            end

            test "should get epic metrics" do
                get '/api/v1/metrics/epics'
                assert_response :success
            end

            test "should get teams" do
                get '/api/v1/teams'
                assert_response :success
            end

            test "should get a team's bug metrics" do
                get '/api/v1/bugs/1'
                assert_response :success
            end
        end
    end
end