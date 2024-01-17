class CurrentUserSerializer < ActiveModel::Serializer
  attributes :id, :name, :bio, :image

  def image_url
    object.image.url if object.image.present?
  end
end