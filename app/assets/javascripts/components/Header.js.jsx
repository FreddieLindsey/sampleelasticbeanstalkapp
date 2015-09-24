import React from 'react';

export default class Header extends React.Component {

  static displayName = 'Header';
  static propTypes = {
    siteName: React.PropTypes.string.isRequired,
    links: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired
      })
    )
  };
  static defaultProps = {};

  componentDidMount() {
    this.handleHighlight();
  }

  handleClick = () => {
    let nav = this.refs['nav'].getDOMNode();
    nav.className = (nav.className === 'site-nav') ?
      'site-nav-mobile' :
      'site-nav';
  }

  handleHighlight(links = this.props.links, refs = this.refs) {
    links.forEach((link) => {
      let path = window.location.pathname;
      if (path === '') { path = '/' };
      if (path === link.url) {
        refs[link.url].getDOMNode().className +=
          ' site-nav-link--highlight';
      };
    });
  }

  renderHeader() {
    return (
      <div>
        <a className="site-header-title" href="/" >
          {this.props.siteName}
        </a>
        <button className="site-nav-mobile--button fa fa-bars"
          onClick={this.handleClick}></button>
      </div>
    );
  }

  renderLinks(links = this.props.links) {
    return (
      <ul ref="nav" className="site-nav">
        { links.length > 0 &&
          links.map((link) => {
            return (
              <li key={link.title} >
                <a href={link.url} >
                  <div ref={link.url} className="site-nav-link" >
                    {link.title}
                  </div>
                </a>
              </li>
            );
          })
        }
      </ul>
    );
  }

  render() {
    return (
      <div className="site-header">
        { this.renderHeader() }
        { this.renderLinks() }
      </div>
    );
  }
}
