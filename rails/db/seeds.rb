ActiveRecord::Base.transaction do
  user1 = User.create!(name: "テスト太郎", email: "test1@example.com", password: "password", confirmed_at: Time.current)

  user2 = User.create!(name: "テスト次郎", email: "test2@example.com", password: "password", confirmed_at: Time.current)

  15.times do |i|
    Post.create!(title: "テストタイトル1-#{i}", content: "テスト本文1-#{i}",  # image: File.open("./public/test.jpg"), audio: File.open("./public/hana.mp3"),
                 status: :published, user: user1)
    Post.create!(title: "テストタイトル2-#{i}", content: "テスト本文2-#{i}", # image: File.open("./public/hhkb.jpg"), audio: File.open("./public/kiniro.mp3"),
                 status: :published, user: user2)
  end
end
