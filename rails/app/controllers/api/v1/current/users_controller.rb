class Api::V1::Current::UsersController < Api::V1::BaseController
  before_action :authenticate_user!

  def show
    render json: current_user, serializer: CurrentUserSerializer
  end

  def update
    if current_user.update(user_params)
      render json: current_user, serializer: CurrentUserSerializer
    else
      render json: { errors: current_user.errors }, status: :unprocessable_entity
    end
  end
end

private

  def user_params
    params.require(:user).permit(:name, :email, :bio, :image)
  end
