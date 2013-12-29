class CreateGoals < ActiveRecord::Migration
  def change
    create_table :goals do |t|
      t.integer :activity_timer_id
      t.integer :value

      t.timestamps
    end
  end
end
