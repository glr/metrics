require 'test_helper'

class Metrics::StoryBrTest < ActiveSupport::TestCase
  def setup
    @storyBR = Metrics::StoryBr.create(bigrocks:1, other:1, report_period:"December 11, 2019")
  end

  test "StoryBR should be valid" do
    assert @storyBR.valid?
  end
end
