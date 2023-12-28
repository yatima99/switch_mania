require "rails_helper"

RSpec.describe "Api::V1::Current::Likes", type: :request do
  let(:user) { create(:user) }
  let(:test_post) { create(:post, user:) }
  let(:headers) { user.create_new_auth_token }

  describe "POST /api/v1/current/posts/:post_id/likes" do
    subject { post api_v1_current_post_likes_path(post_id: test_post.id), headers: }

    it "creates a new like for the post" do
      expect { subject }.to change { Like.count }.by(1)
      expect(response).to have_http_status(:created)
    end
  end

  describe "DELETE /api/v1/current/likes/:id" do
    subject { delete api_v1_current_like_path(id: like.id), headers: }

    let!(:like) { create(:like, user:, post: test_post) }

    it "deletes the like" do
      expect { subject }.to change { Like.count }.by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
