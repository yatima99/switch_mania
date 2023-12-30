class Api::V1::Current::PostsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    posts = current_user.posts.not_unsaved.order(created_at: :desc)
    render json: posts
  end

  def show
    post = Post.find(params[:id])
    like = current_user.likes.find_by(post_id: post.id)
    liked_by_current_user = like.present?
    like_id = like&.id
    render json: post, serializer: PostSerializer, additional_info: { liked: liked_by_current_user, like_id: }
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

  def destroy
    post = current_user.posts.find(params[:id])
    post.destroy!
    head :no_content
  end

  def liked_posts
    liked_posts = current_user.liked_posts.order(created_at: :desc)
    render json: liked_posts
  end

  private

    def post_params
      params.require(:post).permit(:title, :content, :status, :image, :audio)
    end
end
