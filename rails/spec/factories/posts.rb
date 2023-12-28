FactoryBot.define do
  factory :post do
    user
    title { Faker::Lorem.sentence }
    content { Faker::Lorem.paragraph }
    image { Rack::Test::UploadedFile.new(Rails.root.join("spec/fixtures/sample_image.jpg"), "image/jpeg") }
    audio { Rack::Test::UploadedFile.new(Rails.root.join("spec/fixtures/sample_audio.mp3"), "audio/mpeg") }
    status { :published }
  end
end
