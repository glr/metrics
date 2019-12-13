require 'test_helper'

class Metrics::SprintTest < ActiveSupport::TestCase
  def setup
    @team = Team.create()
    @sprint = Metrics::Sprint.create(
      name: "test",
      goal:"test",
      scope_change_pct:0.00,
      forecast_error_pct:0.00,
      story_pct:0.00,
      spike_pct:0.00,
      bug_pct:0.00,
      data_fix_pct:0.00,
      operational_work_pct:0.00,
      incident_pct:0.00,
      technical_debt_pct:0.00,
      team_id:@team.id,
      jid:1
    )
    end

  test "Sprint should be valid" do
    assert @sprint.valid?
  end
end
