class Api::V1::Current::PostsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    posts = current_user.posts.not_unsaved.order(created_at: :desc)
    render json: posts
  end

  def show
    post = current_user.posts.find(params[:id])
    render json: post
  end

  def create
    unsaved_post = current_user.posts.unsaved.first || current_user.posts.create!(status: :unsaved)
    render json: unsaved_post
  end

  def update
    post = current_user.posts.find(params[:id])
    post.update!(post_params)
    render json: post
  end

  private

    def post_params
      params.require(:post).permit(:title, :content, :status, :image)
    end
end
