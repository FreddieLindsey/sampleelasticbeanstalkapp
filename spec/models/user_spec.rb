require 'rails_helper'

RSpec.describe User, type: :model do
  context 'Creating a user' do
    before(:each) do
      @first_name = 'Bob'
      @last_name = 'Hillbilly'
      @email = 'bob@hillbilly.com'
      @password = 'billythehillbilly'
      @u = User.new(
        first_name: @first_name,
        last_name: @last_name,
        email: @email,
        password: @password,
        password_confirmation: @password
      )
    end

    it 'should be valid with a valid user' do
      expect(@u.valid?).to be true
    end

    it 'should be invalid with no first_name' do
      @u[:first_name] = nil
      expect(@u.valid?).to be false
    end

    it 'should be invalid with no last_name' do
      @u[:last_name] = nil
      expect(@u.valid?).to be false
    end

    it 'should be invalid with no email' do
      @u[:email] = nil
      expect(@u.valid?).to be false
    end
  end

  context 'Deleting a user' do
    before(:each) do
      @first_name = 'Bob'
      @last_name = 'Hillbilly'
      @email = 'bob@hillbilly.com'
      @password = 'billythehillbilly'
      @u = User.create(
        first_name: @first_name,
        last_name: @last_name,
        email: @email,
        password: @password,
        password_confirmation: @password
      )
    end

    it 'should delete for a valid user' do
      @u.destroy
      expect(@u.destroyed?).to be true
    end
  end
end
