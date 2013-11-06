class CreateEvents < ActiveRecord::Migration
  def change
    create_table 'events', :force => true do |t|
      t.string :type
      t.text :description
      t.integer :actor_id
      t.integer :actor_type
      t.integer :target_id
      t.string :target_type

      t.timestamps
    end
  end
end
