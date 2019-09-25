class AddJidToMetricsSprint < ActiveRecord::Migration[6.0]
  def change
    add_column :metrics_sprints, :jid, :integer
  end
end
