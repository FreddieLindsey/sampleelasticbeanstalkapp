require 'flipper'
require 'flipper/adapters/activerecord'
require 'flipper/adapters/memory'

$flipper = Flipper.new(Rails.env.test? ? Flipper::Adapters::Memory.new : Flipper::Adapters::ActiveRecord.new)

# Define flipper features
current_features = [
  :administration
]

Flipper.register(:admins) { |actor| actor.is_a?(User) && actor.admin? }

if ActiveRecord::Base.connection.table_exists? 'flipper_features'
  # Ensure features exist
  current_features.each do |feature|
    $flipper.adapter.add(
      Flipper::Feature.new(feature, $flipper.adapter)
    )
  end

  # Cleanup old features
  $flipper.features.each do |feature|
    unless current_features.include? feature.name.to_sym
      $flipper.adapter.remove(
        Flipper::Feature.new(feature.name, $flipper.adapter)
      )
    end
  end
end
