class CreateActivityTimer < ActiveRecord::Migration
  def up
    create_table 'activity_timers' do |t|
      t.integer :user_id
      t.string :title, :default => 'timer'
      t.integer :time, :default => 25
      t.integer :break_time, :default => 5

      t.timestamps
    end
  end

  def down
    drop_table :activity_timers
  end
end
