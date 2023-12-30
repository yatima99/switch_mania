class Api::V1::PostsController < Api::V1::BaseController
  include Pagination

  def index
    posts = Post.published.order(created_at: :desc).page(params[:page] || 1).per(12).includes(:user)
    render json: posts, meta: pagination(posts), adapter: :json
  end

  def show
    post = Post.published.find(params[:id])

    if user_signed_in?
      like = current_user.likes.find_by(post_id: post.id)
      liked_by_current_user = like.present?
      like_id = like&.id
      render json: post, serializer: PostSerializer, additional_info: { liked: liked_by_current_user, like_id: }
    else
      render json: post
    end
  end
end
