class AddInvestigationColumnToMetricsT3Model < ActiveRecord::Migration[6.0]
  def change
    add_column :metrics_t3s, :investigation, :integer
  end
end
