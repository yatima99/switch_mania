RSpec.describe "Api::V1::Current::Comments", type: :request do
  let(:user) { create(:user) }
  let(:test_post) { create(:post, user:) }
  let(:headers) { user.create_new_auth_token }

  describe "POST /api/v1/current/posts/:post_id/comments" do
    subject { post api_v1_current_post_comments_path(post_id: test_post.id), headers:, params: { comment: { content: "テストコメント" } } }

    it "コメントを作成する" do
      expect { subject }.to change { Comment.count }.by(1)
      expect(response).to have_http_status(:created)
    end
  end

  describe "DELETE /api/v1/current/posts/:post_id/comments/:id" do
    subject { delete api_v1_current_post_comment_path(post_id: test_post.id, id: comment.id), headers: }

    let!(:comment) { create(:comment, user:, post: test_post) }

    it "deletes the comment" do
      expect { subject }.to change { Comment.count }.by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
