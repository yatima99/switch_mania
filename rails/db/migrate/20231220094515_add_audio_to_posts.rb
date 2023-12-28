class AddAudioToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :audio, :string
  end
end
