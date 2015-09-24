import React from 'react';
import Request from 'superagent';

export default class Blog extends React.Component {

  static displayName = 'Blog';
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    desc: React.PropTypes.string.isRequired,
    posts: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        blurb: React.PropTypes.string.isRequired
      })
    ),
    admin: React.PropTypes.bool,
    id: React.PropTypes.number,
    auth_token: React.PropTypes.string
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    let state = {
      name: props.name,
      desc: props.desc
    }
    if (props.admin) {
      state.changed = false;
      state.name_saved = props.name;
      state.desc_saved = props.desc;
    }
    this.state = state;
  }

  componentDidMount() {
    this.handleTextArea(this.refs['blog-desc-input'].getDOMNode());
  }

  handleCancel = () => {
    if (this.props.admin) {
      if (this.props.id) {
        this.setState({
          changed: false,
          name: this.state.name_saved,
          desc: this.state.desc_saved
        })
      } else {
        this.setState({
          name: this.props.name,
          desc: this.props.desc
        })
      }
    }
  }

  handleChange = () => {
    let changed = this.state.name !== this.state.name_saved ||
                  this.state.desc !== this.state.desc_saved;
    if (this.props.admin) {
      this.setState({
        changed: changed
      })
    }
  }

  handleDelete = () => {
    if (this.props.id) {
      Request
        .del('/api/blog/destroy')
        .send({
          id: this.props.id,
          authenticity_token: this.props.auth_token
        })
        .end((_, res) => {
          if (res.ok) {
            window.location = '/'
          } else {
            alert(res.data);
          }
        });
    }
  }

  handleDesc = (e) => {
    let target = e.target || event.srcElement || event.target;
    this.state.desc = target.value;
    this.handleTextArea(target);
    this.handleChange();
  }

  handleName = (e) => {
    let target = e.target || event.srcElement || event.target;
    this.state.name = target.value;
    this.handleChange();
  }

  handleSave = () => {
    let name = this.state.name.trim();
    let desc = this.state.desc.trim();
    if (this.props.id) {
      Request
        .post('/api/blog/edit')
        .send({
          id: this.props.id,
          authenticity_token: this.props.auth_token,
          name: name,
          desc: desc
        })
        .end((_, res) => {
          if (res.ok) {
            this.setState({
              changed: false,
              name: name,
              name_saved: name,
              desc: desc,
              desc_saved: desc
            }, function() {
              alert('Blog saved successfully!');
            })
          } else {
            alert(res.data);
          }
        });
    } else {
      Request
        .post(`/api/blog/create`)
        .send({
          authenticity_token: this.props.auth_token,
          name: name,
          desc: desc
        })
        .end((_, res) => {
          let resData = JSON.parse(res.text);
          if (res.ok) {
            window.location = `/blog/${resData.id}`
          } else {
            alert(res.data);
          }
        });
    }
  }

  handleTextArea = (area) => {
    if (this.props.admin) {
      area.rows = area.value.split("\n").length + 1 || 2;
    }
  }

  renderBlogInfo() {
    return (this.props.admin) ? (
      <div className="blog-info">
        <input
          ref="blog-name-input"
          className="blog-name-input" placeholder="Blog name"
          value={ this.state.name } onChange={ this.handleName }/>
        <textarea
          ref="blog-desc-input"
          className="blog-desc-input" placeholder="Blog description"
          value={ this.state.desc } onChange={ this.handleDesc }/>
      </div>
    ) : (
      <div className="blog-info">
        <h1 className="blog-name" >{ this.state.name.trim() }</h1>
        <p className="blog-desc" >{ this.state.desc.trim() }</p>
      </div>
    );
  }

  renderDelete() {
    if (this.props.admin) {
      return (
        <div className="blog-delete" >
          <button className="blog-delete__button" onClick={ this.handleDelete } >
            Delete Blog
          </button>
        </div>
      );
    }
  }

  renderViewControllerButtons() {
    return (
      <div className="blog-view-controller">
        <button className="blog-view__button--cancel"
          onClick={this.handleCancel}>
          Cancel
        </button>
        <button className="blog-view__button--save"
          onClick={this.handleSave}>
          Save
        </button>
      </div>
    );
  }

  renderPosts() {
    return (
      <ul>
        { this.props.posts &&
          this.props.posts.map((post) => {
            return (<li key={post.id} >{post.title}</li>);
          })
        }
      </ul>
    );
  }

  render() {
    return (
      <div className="blog">
        { this.props.admin &&
          <div className="blog-edit-palette">
            { (this.state.changed || !this.props.id) && this.renderViewControllerButtons() }
          </div>
        }
        { this.renderBlogInfo() }
        { this.props.posts && <hr /> }
        { this.props.posts && this.renderPosts() }
        { this.props.admin && this.props.id && <hr /> }
        { this.props.admin && this.props.id && this.renderDelete() }
      </div>
    );
  }

}
