require 'test_helper'

class TeamTest < ActiveSupport::TestCase
  def setup
    @team = Team.create(jid:1, bid: 1, name: "test", last_sprint:1, current_sprint:1)
  end

  test "Team should be valid" do
    assert @team.valid?
  end
end
