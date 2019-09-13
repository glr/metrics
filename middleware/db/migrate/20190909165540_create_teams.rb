class CreateTeams < ActiveRecord::Migration[6.0]
  def change
    create_table :teams do |t|
      t.integer :jid
      t.integer :bid
      t.string :name
      t.integer :last_sprint
      t.integer :current_sprint

      t.timestamps
    end
  end
end
