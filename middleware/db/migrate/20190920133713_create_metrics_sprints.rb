class CreateMetricsSprints < ActiveRecord::Migration[6.0]
  def change
    create_table :metrics_sprints do |t|
      t.string :name
      t.text :goal
      t.string :scope_change_pct
      t.string :forecast_error_pct
      t.string :story_pct
      t.string :spike_pct
      t.string :bug_pct
      t.string :data_fix_pct
      t.string :operational_work_pct
      t.string :incident_pct
      t.string :technical_debt_pct
      t.references :team, null: false, foreign_key: true
      t.timestamps
    end
  end
end
