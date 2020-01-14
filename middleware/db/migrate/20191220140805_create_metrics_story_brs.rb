class CreateMetricsStoryBrs < ActiveRecord::Migration[6.0]
  def change
    create_table :metrics_story_brs do |t|

      t.timestamps
    end
  end
end
