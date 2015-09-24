### DATABASE SEED

unless Rails.env.production?
  # Clear user table
  User.all.each(&:destroy)

  User.create(
    first_name: 'Sample',
    last_name: 'User',
    email: 'sampleuser@helloworld.com',
    password: 'passw0rd',
    password_confirmation: 'passw0rd',
    admin: true
  )
end

$flipper[:administration].enable_group :admins
