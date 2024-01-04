class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :status, :created_at, :image, :audio
  has_many :tags
  attribute :liked, if: -> { additional_info.present? }
  attribute :like_id, if: -> { additional_info.present? }
  belongs_to :user, serializer: UserSerializer

  def created_at
    object.created_at.strftime("%Y/%m/%d")
  end

  def status
    object.status_i18n
  end

  def liked
    additional_info[:liked] if additional_info
  end

  def like_id
    additional_info[:like_id] if additional_info
  end

  private

    def additional_info
      @instance_options[:additional_info] || {}
    end
end
