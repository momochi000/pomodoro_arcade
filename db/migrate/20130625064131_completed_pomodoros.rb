class CompletedPomodoros < ActiveRecord::Migration
  def up
    create_table 'completed_pomodoros' do |t|
      t.integer :activity_timer_id
      t.datetime :started_at
      t.datetime :completed_at

      t.timestamps
    end
  end

  def down
    drop_table :completed_pomodoros
  end
end
