module Types
  class QueryType < Types::BaseObject
    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    # TODO: remove me
    field :test_field, String, null: false,
      description: "An example field added by the generator"
    def test_field
      "Hello World!"
    end

    field :teams,
          [Types::TeamType],
          null: false,
          description: 'Returns a list of teams for which metrics exist'

    def teams
      Team.all
    end
  end
end
