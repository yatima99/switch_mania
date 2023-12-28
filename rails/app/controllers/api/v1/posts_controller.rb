class Api::V1::PostsController < Api::V1::BaseController
  include Pagination

  def index
    posts = Post.published.order(created_at: :desc).page(params[:page] || 1).per(12).includes(:user)
    render json: posts, meta: pagination(posts), adapter: :json
  end

  def show
    post = Post.published.find(params[:id])
    render json: post
  end
end
