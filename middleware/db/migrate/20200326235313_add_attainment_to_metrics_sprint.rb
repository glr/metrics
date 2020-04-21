class AddAttainmentToMetricsSprint < ActiveRecord::Migration[6.0]
  def change
    add_column :metrics_sprints, :attainment, :float
  end
end
