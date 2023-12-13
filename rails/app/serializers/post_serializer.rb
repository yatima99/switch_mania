class PostSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :created_at
  belongs_to :user, serializer: UserSerializer

  def created_at
    object.created_at.strftime("%Y/%m/%d")
  end
end
