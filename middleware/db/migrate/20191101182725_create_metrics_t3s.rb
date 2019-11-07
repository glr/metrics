class CreateMetricsT3s < ActiveRecord::Migration[6.0]
  def change
    create_table :metrics_t3s do |t|
      t.date :startDate
      t.date :endDate
      t.integer :customDev
      t.integer :quote
      t.integer :split
      t.integer :merge
      t.integer :postConversion
      t.integer :sre
      t.integer :datafix
      t.integer :csl1
      t.integer :documentation
      t.integer :ccMerge
      t.integer :other

      t.timestamps
    end
  end
end
