class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :created_at, :user
  belongs_to :user, serializer: UserSerializer

  def created_at
    object.created_at.strftime("%Y/%m/%d %H:%M")
  end
end
