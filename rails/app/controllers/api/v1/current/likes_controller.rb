class Api::V1::Current::LikesController < Api::V1::BaseController
  before_action :authenticate_user!

  def create
    post = Post.find(params[:post_id])
    like = current_user.likes.create!(post:)
    if like.persisted?
      render json: { id: like.id, status: "created" }, status: :created
    else
      render json: { error: like.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    like = current_user.likes.find(params[:id])
    like.destroy!
    head :no_content
  end
end
