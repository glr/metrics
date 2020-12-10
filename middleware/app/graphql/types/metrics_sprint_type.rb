module Types
  class MetricsSprintType < Types::BaseObject
    field :id, ID, null: true
    field :team_id, ID ,null: true
    field :jid, ID,null: true
    field :name, String, null: true
    field :goal, String, null: true
    field :scope_change_pct, Float, null: true
    field :forecast_error_pct, Float, null: true
    field :story_pct, Float, null: true
    field :spike_pct, Float, null: true
    field :bug_pct, Float, null: true
    field :data_fix_pct, Float, null: true
    field :operational_work_pct, Float, null: true
    field :incident_pct, Float, null: true
    field :technical_debt_pct, Float, null: true
    field :attainment, Float, null: true
    field :created_at, String, null: true
    field :updated_at, String, null: true
  end
end
