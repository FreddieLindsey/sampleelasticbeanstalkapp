class Blog < ActiveRecord::Base
  has_many :posts, dependent: :destroy

  validates :name, presence: true, null: false
  validates :description, presence: true, null: false
end
