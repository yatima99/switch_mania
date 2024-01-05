require "rails_helper"

RSpec.describe "Api::V1::Tags", type: :request do
  describe "GET /api/v1/tags" do
    let!(:post1) { create(:post) }
    let!(:post2) { create(:post) }
    let!(:tag1) { create(:tag, posts: [post1]) }
    let!(:tag2) { create(:tag, posts: [post2]) }

    it "投稿に紐づいたタグのリストを返すこと" do
      get api_v1_tags_path

      expect(response).to have_http_status(:ok)
      expect(response.content_type).to eq("application/json; charset=utf-8")

      json = JSON.parse(response.body)
      expect(json.size).to eq(2)
      expect(json).to include({ "id" => tag1.id, "name" => tag1.name })
      expect(json).to include({ "id" => tag2.id, "name" => tag2.name })
    end
  end
end
