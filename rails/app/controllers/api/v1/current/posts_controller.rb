class Api::V1::Current::PostsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    posts = current_user.posts.includes(:tags).not_unsaved.order(created_at: :desc)
    render json: posts
  end

  def show
    post = Post.includes(:tags, :comments).find(params[:id])
    like = current_user.likes.find_by(post_id: post.id)
    liked_by_current_user = like.present?
    like_id = like&.id

    render json: post, serializer: PostSerializer, additional_info: {
      liked: liked_by_current_user,
      like_id:,
    }
  end

  def create
    unsaved_post = current_user.posts.unsaved.first || current_user.posts.create!(status: :unsaved)
    render json: unsaved_post
  end

  def update
    post = current_user.posts.find(params[:id])
    post.update!(post_params.except(:tags))

    if params[:post][:tags].blank?

      post.tags.clear
    else
      new_tags = params[:post][:tags].split(" ").uniq
      new_tag_objects = new_tags.map {|tag_name| Tag.find_or_create_by(name: tag_name) }

      post.tags = new_tag_objects
    end

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

  def recommended_posts
    liked_post_ids = current_user.likes.pluck(:post_id)
    recent_liked_posts = current_user.likes.order(created_at: :desc).limit(10).map(&:post)
    recent_tags = recent_liked_posts.flat_map(&:tags).uniq
    recommended_posts = Post.joins(:tags).
                          where.not(id: liked_post_ids). # すでにいいねした投稿を除外
                          where(tags: { id: recent_tags.map(&:id) }).
                          includes(:user).
                          distinct

    render json: recommended_posts
  end

  private

    def post_params
      params.require(:post).permit(:title, :content, :status, :image, :audio, :tags)
    end
end
