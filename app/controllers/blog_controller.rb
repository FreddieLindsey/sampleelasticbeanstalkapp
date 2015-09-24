class BlogController < ApplicationController
  def show
    @blog = Blog.find(params[:id])
    @props = {
      name: @blog.name,
      desc: @blog.description,
      posts: @blog.posts
    }
    if feature_enabled?(:administration)
      @props[:admin] = true
      @props[:id] = @blog.id
      @props[:auth_token] = form_authenticity_token
    end
    @props
  end

  def new
    if feature_enabled?(:administration)
      @props = {
        name: '',
        desc: '',
        admin: true,
        auth_token: form_authenticity_token
      }
    else
      redirect_to 'noauth#index'
    end
  end

  def create
    blog = Blog.new(name: params[:name], description: params[:desc])
    if blog.valid?
      blog.save
      render json: { id: blog.id },
             status: 200,
             content_type: 'text/json'
    else
      render json: { data: 'Blog parameters invalid' },
             status: 409,
             content_type: 'text/json'
    end
  end

  def edit
    if (blog = Blog.find(params[:id]))
      if params[:name] == ''
        render json: { data: 'Blog name cannot be blank', blog_name: 'Name cannot be blank' },
               status: 409,
               content_type: 'text/json'
        return
      end
      blog.name = params[:name]
      unless blog.valid?
        render json: { data: 'Blog name already exists', blog_name: 'Name already exists' },
               status: 409,
               content_type: 'text/json'
        return
      end
      if params[:desc] == ''
        render json: { data: 'Blog description cannot be blank', blog_desc: 'Description cannot be blank' },
               status: 409,
               content_type: 'text/json'
        return
      end
      blog.description = params[:desc]
      unless blog.valid?
        render json: { data: 'Blog description invalid', blog_desc: 'Description invalid' },
               status: 409,
               content_type: 'text/json'
        return
      end
      if blog.save
        render json: { data: 'Blog saved successfully' },
               status: 200,
               content_type: 'text/json'
        return
      end
    end
    render json: { data: 'Blog unable to be saved' }, status: 500, content_type: 'text/json'
  end

  def destroy
    if (blog = Blog.find(params[:id]))
      blog.destroy
      render json: {},
             status: 200,
             content_type: 'text/json'
    else
      render json: { data: 'Blog could not be deleted' },
             status: 409,
             content_type: 'text/json'
    end
  end
end
