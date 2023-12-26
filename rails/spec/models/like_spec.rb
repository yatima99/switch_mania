# spec/models/like_spec.rb
require "rails_helper"

RSpec.describe Like, type: :model do
  describe "Factory" do
    it "正常にレコードを新規作成できる" do
      expect { create(:like) }.to change { Like.count }.by(1)
    end
  end

  describe "Validations" do
    let(:user) { create(:user) }
    let(:post) { create(:post) }
    let(:like) { build(:like, user:, post:) }

    context "全ての値が正常な時" do
      it "検証が通る" do
        expect(like).to be_valid
      end
    end

    context "同一の投稿に対して同一ユーザーが再度いいねをしようとした時" do
      before { create(:like, user:, post:) }

      it "検証が通らない" do
        expect(like).not_to be_valid
        expect(like.errors.full_messages).to include("Userはすでに存在します")
      end
    end
  end
end
