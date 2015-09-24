module ApplicationHelper
  def react_component(component_name, props, div_id = 'container')
    if props.class == Hash
      "<div id=#{div_id}></div>".html_safe +
        javascript_tag('React.render(' \
                       "React.createElement(#{component_name}" \
                       ", #{props.to_json})," \
                       "document.getElementById(\"#{div_id}\"));")
    else
      javascript_tag('console.warn(\"The second argument of react_component' \
                     ' has to be a hash object. \")')
    end
  end

  def blog_links
    if feature_enabled?(:administration)
      blogs = [{
        title: 'Create Blog',
        url: '/blog/new'
      }]
    else
      blogs = []
    end
    Blog.all.each do |blog|
      blogs << {
        title: blog.name,
        url: "/blog/#{blog.id}"
      }
    end
    blogs
  end

  def user_signin_links
    if user_signed_in?
      [
        { title: 'Profile', url: edit_user_registration_path },
        { title: 'Logout', url: destroy_user_session_path }
      ]
    else
      [
        { title: 'Sign up!', url: new_user_registration_path },
        { title: 'Login', url: new_user_session_path }
      ]
    end
  end

  def feature_enabled?(feature, actor = current_user)
    $flipper[feature.to_sym].enabled?(actor)
  end
end
