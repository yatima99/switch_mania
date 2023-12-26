class Api::V1::Current::LikesController < Api::V1::BaseController
  before_action :authenticate_user!

  def create
    post = Post.find(params[:post_id])
    like = current_user.likes.create!(post:)
    render json: like, status: :created
  end

  def destroy
    like = current_user.likes.find_by!(post_id: params[:id])
    like.destroy!
    head :no_content
  end
end
