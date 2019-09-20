class ChangeStringsToFloatsForPercentages < ActiveRecord::Migration[6.0]
  def change
    change_column :metrics_sprints, :scope_change_pct, 'double precision USING CAST(scope_change_pct AS double precision)'
    change_column :metrics_sprints, :forecast_error_pct, 'double precision USING CAST(forecast_error_pct AS double precision)'
    change_column :metrics_sprints, :story_pct, 'double precision USING CAST(story_pct AS double precision)'
    change_column :metrics_sprints, :spike_pct, 'double precision USING CAST(spike_pct AS double precision)'
    change_column :metrics_sprints, :bug_pct, 'double precision USING CAST(bug_pct AS double precision)'
    change_column :metrics_sprints, :data_fix_pct, 'double precision USING CAST(data_fix_pct AS double precision)'
    change_column :metrics_sprints, :operational_work_pct, 'double precision USING CAST(operational_work_pct AS double precision)'
    change_column :metrics_sprints, :incident_pct, 'double precision USING CAST(incident_pct AS double precision)'
    change_column :metrics_sprints, :technical_debt_pct, 'double precision USING CAST(technical_debt_pct AS double precision)'
  end
end
