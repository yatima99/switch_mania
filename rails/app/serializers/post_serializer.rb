class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :status, :created_at
  belongs_to :user, serializer: UserSerializer

  def created_at
    object.created_at.strftime("%Y/%m/%d")
  end

  def status
    object.status_i18n
  end
end