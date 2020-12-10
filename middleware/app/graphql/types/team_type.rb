module Types
  class TeamType < Types::BaseObject
    SPRINTS_TO_SHOW = 7

    field :id, ID, null: true
    field :jid, ID, null: true
    field :bid, ID, null: true
    field :name, String, null: true
    field :last_sprint, Integer, null: true
    field :current_sprint, Integer, null: true
    field :metrics, [Types::MetricsSprintType], null: true

    def metrics
      Metrics::Sprint.where(team_id: object.id).order(:created_at).last(SPRINTS_TO_SHOW)
    end
  end
end
