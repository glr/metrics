require 'test_helper'

class Metrics::EpicTest < ActiveSupport::TestCase
  def setup
    @epic = Metrics::Epic.create(wip_bigrocks:1, wip_other:1, todo_bigrocks:1, todo_other:1, report_period:"December 11, 2019")
  end

  test "Epic should be valid" do
    assert @epic.valid?
  end
end
