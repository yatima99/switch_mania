class Api::V1::Current::CommentsController < Api::V1::BaseController
  before_action :authenticate_user!

  def create
    post = Post.find(params[:post_id])
    comment = current_user.comments.create!(comment_params.merge(post:))

    if comment.persisted?
      render json: { id: comment.id, content: comment.content, status: "created" }, status: :created
    else
      render json: { error: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    comment = current_user.comments.find(params[:id])
    comment.destroy!
    head :no_content
  end

  private

    def comment_params
      params.require(:comment).permit(:content)
    end
end
