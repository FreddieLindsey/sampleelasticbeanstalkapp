class Post < ActiveRecord::Base
  belongs_to :blog

  validates :title, presence: true, null: false
  validates :blurb, presence: true, null: false
  validates :content, presence: true, null: false
end
