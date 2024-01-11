require "rails_helper"

RSpec.describe "Api::V1::Posts", type: :request do
  describe "GET api/v1/posts" do
    subject { get(api_v1_posts_path(params)) }

    before do
      create_list(:post, 25, status: :published)
      create_list(:post, 8, status: :draft)
    end

    context "page を params で送信しない時" do
      let(:params) { nil }

      it "1ページ目のレコード12件取得できる" do
        subject
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["posts", "meta"]
        expect(res["posts"].length).to eq 12
        expect(res["posts"][0].keys).to eq ["id", "title", "content", "status", "created_at", "image", "audio", "tags", "comments", "user"]
        expect(res["posts"][0]["user"].keys).to eq ["id", "name"]
        expect(res["meta"].keys).to eq ["current_page", "total_pages"]
        expect(res["meta"]["current_page"]).to eq 1
        expect(res["meta"]["total_pages"]).to eq 3
        expect(response).to have_http_status(:ok)
      end
    end

    context "page を params で送信した時" do
      let(:params) { { page: 2 } }

      it "該当ページ目のレコード12件取得できる" do
        subject
        res = JSON.parse(response.body)
        expect(res.keys).to eq ["posts", "meta"]
        expect(res["posts"].length).to eq 12
        expect(res["posts"][0].keys).to eq ["id", "title", "content", "status", "created_at", "image", "audio", "tags", "comments", "user"]
        expect(res["posts"][0]["user"].keys).to eq ["id", "name"]
        expect(res["meta"].keys).to eq ["current_page", "total_pages"]
        expect(res["meta"]["current_page"]).to eq 2
        expect(res["meta"]["total_pages"]).to eq 3
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET api/v1/posts/:id" do
    subject { get(api_v1_post_path(post_id)) }

    let(:post) { create(:post, status:) }

    context "post_id に対応する posts レコードが存在する時" do
      let(:post_id) { post.id }

      context "posts レコードのステータスが公開中の時" do
        let(:status) { :published }

        it "正常にレコードを取得できる" do
          subject
          res = JSON.parse(response.body)
          expect(res.keys).to eq ["id", "title", "content", "status", "created_at", "image", "audio", "tags", "comments", "user"]
          expect(res["user"].keys).to eq ["id", "name"]
          expect(response).to have_http_status(:ok)
        end
      end

      context "posts レコードのステータスが下書きの時" do
        let(:status) { :draft }

        it "ActiveRecord::RecordNotFound エラーが返る" do
          expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
        end
      end
    end

    context "post_id に対応する posts レコードが存在しない時" do
      let(:post_id) { 10_000_000_000 }

      it "ActiveRecord::RecordNotFound エラーが返る" do
        expect { subject }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
