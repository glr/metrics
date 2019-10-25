class CreateMetricsEpics < ActiveRecord::Migration[6.0]
  def change
    create_table :metrics_epics do |t|
      t.integer :wip_bigrocks
      t.integer :wip_other
      t.integer :todo_bigrocks
      t.integer :todo_other
      t.string :report_period

      t.timestamps
    end
  end
end
