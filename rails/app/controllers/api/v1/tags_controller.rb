class Api::V1::TagsController < Api::V1::BaseController
  def index
    tags = Tag.joins(:posts).distinct
    render json: tags
  end
end
