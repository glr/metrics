require 'test_helper'

class Metrics::T3Test < ActiveSupport::TestCase
  def setup
    @t3 = Metrics::T3.create(startDate: "2019-09-18", endDate: "2019-10-01", customDev:1, quote:1, split:1, merge:1, postConversion:1, sre:1, datafix:1, csl1:1, documentation:1, ccMerge:1, other:1)
  end

  test "T3 should be valid" do
    assert @t3.valid?
  end
end
