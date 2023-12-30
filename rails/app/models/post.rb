class Post < ApplicationRecord
  belongs_to :user
  has_many :likes, dependent: :destroy
  mount_uploader :image, ImageUploader
  mount_uploader :audio, AudioUploader
  enum :status, { unsaved: 10, draft: 20, published: 30 }, _prefix: true
  validates :title, :content, presence: true, if: :published?
  validate :verify_only_one_unsaved_status_is_allowed

  def liked_by?(user)
    likes.where(user:).exists?
  end

  private

    def verify_only_one_unsaved_status_is_allowed
      if unsaved? && user.posts.unsaved.present?
        raise StandardError, "未保存の記事は複数保有できません"
      end
    end
end
