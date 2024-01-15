class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :bio, :image_url

  def image_url
    object.image.url if object.image.present?
  end
end