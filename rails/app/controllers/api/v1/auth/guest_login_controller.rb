class Api::V1::Auth::GuestLoginController < Api::V1::BaseController
  def create
    user = User.guest
    token = user.create_new_auth_token

    response.headers["access-token"] = token["access-token"]
    response.headers["token-type"] = "Bearer"
    response.headers["client"] = token["client"]
    response.headers["expiry"] = token["expiry"]
    response.headers["uid"] = token["uid"]

    render json: { status: "success", data: user }, status: :ok
  end
end
