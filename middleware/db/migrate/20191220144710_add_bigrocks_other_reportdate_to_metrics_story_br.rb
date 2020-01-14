class AddBigrocksOtherReportdateToMetricsStoryBr < ActiveRecord::Migration[6.0]
  def change
    add_column :metrics_story_brs, :bigrocks, :integer
    add_column :metrics_story_brs, :other, :integer
    add_column :metrics_story_brs, :report_period, :string
  end
end
