class Event < ActiveRecord::Base
  belongs_to :actor, :polymorphic => true
  belongs_to :target, :polymorphic => true

  attr_accessible :target, :actor
end
