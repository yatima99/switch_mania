if Rails.env.production?
  CarrierWave.configure do |config|
    config.storage = :fog
    config.fog_provider = "fog/aws"
    config.fog_credentials = {
      provider: "AWS",
      aws_access_key_id: ENV["AWS_ACCESS_KEY_ID"],
      aws_secret_access_key: ENV["AWS_SECRET_ACCESS_KEY"],
      region: "ap-northeast-1",
    }
    config.fog_directory = "switch-mania-rails"
    config.cache_storage = :fog
    config.fog_public = false
  end
else
  CarrierWave.configure do |config|
    config.asset_host = "http://localhost:3000"
    config.storage = :file
    config.cache_storage = :file
  end
end
