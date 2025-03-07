class Todo < ApplicationRecord
    validates :title, presence: true, uniqueness: true, length: { maximum: 255 }

    scope :recent, -> { order(created_at: :desc) }
end  