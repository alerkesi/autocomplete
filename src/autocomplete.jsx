var Autocomplete = (function() {
  var guid = 0;

  function nodeInRoot(node, root) {
    while (node) {
      if (node === root) {
        return true;
      }
      node = node.parentNode;
    }

    return false;
  }

  return React.createClass({
    displayName: 'Autocomplete',

    getInitialState: function() {
      return {
        isLoading: false,
        isOpen: false,
        focusedIndex: null,
        // if null render empty menu item
        // if empty array disabled previous results
        results: null,
        id: 'autocomplete-' + (guid++),
      };
    },

    componentDidUpdate: function(prevProps, prevState) {
      if (prevState.isOpen && !this.state.isOpen) {
        this.setState({
          focusedIndex: null,
        });
        this.unbindRootCloseHandlers();
      } else if (!prevState.isOpen && this.state.isOpen) {
        this.bindRootCloseHandlers();
      }
    },

    componentDidMount: function() {
      this.bindRootCloseHandlers();
    },

    componentWillUnmount: function() {
      this.unbindRootCloseHandlers();
    },

    bindRootCloseHandlers: function() {
      var elem = React.findDOMNode(this);
      var doc = elem && elem.ownerDocument || document;

      doc.addEventListener('click', this.onDocumentClick, false);
      doc.addEventListener('keyup', this.onDocumentKeyup, false);
    },

    unbindRootCloseHandlers: function() {
      var elem = React.findDOMNode(this);
      var doc = elem && elem.ownerDocument || document;

      doc.removeEventListener('click', this.onDocumentClick, false);
      doc.removeEventListener('keyup', this.onDocumentKeyup, false);
    },

    onChange: function(e) {
      var query = e.target.value;

      this.setState({
        focusedIndex: null,
      });

      if (query.length < 2) {
        this.setState({
          isLoading: false,
          isOpen: false,
          results: null,
        });
      } else if (this.props.onSearch) {
        this.setState({isLoading: true});

        this.props.onSearch(query, function(results) {
          // ajax cancel or result no needed
          if (results === null || !this.state.isLoading) {
            return;
          }

          this.setState({
            isLoading: false,
            isOpen: true,
            results: results,
          });
        }.bind(this));
      }
    },

    onClick: function(i, e) {
      e.preventDefault();

      this.select(i);
    },

    onDocumentClick: function(e) {
      if (!nodeInRoot(e.target, React.findDOMNode(this))) {
        this.setState({
          isOpen: false,
        });
      }
    },

    onKeyDown: function(e) {
      if (this.state.disabled) {
        return;
      }

      switch (e.keyCode) {
        // tab
        case 9:
          this.setState({
            isOpen: false,
          });
          return;

        // enter
        case 13:
          if (this.state.focusedIndex !== null) {
            this.select(this.state.focusedIndex);
          }
          break;

        // escape
        case 27:
          this.setState({
            isOpen: false,
          });
          break;

        // up
        case 38:
          this.focusAdjacentOption('prev');
          break;

        // down
        case 40:
          this.focusAdjacentOption('next');
          break;

        default:
          return;
      }

      e.preventDefault();
    },

    onMouseEnter: function(i) {
      this.setState({
        focusedIndex: i,
      });
    },

    onMouseLeave: function() {
      this.setState({
        focusedIndex: null,
      });
    },

    onFocus: function() {
      if (this.state.results) {
        this.setState({
          isOpen: true,
        });
      }
    },

    select: function(i) {
      this.setState({
        isOpen: false,
      });

      if (this.props.onSelect) {
        this.props.onSelect(this.state.results[i]);
      }
    },

    focusAdjacentOption: function focusAdjacentOption(dir) {
      var ops = this.state.results;

      if (!this.state.isOpen) {
        this.setState({
          isOpen: true,
          focusedIndex: 0,
        });
        return;
      }

      if (!ops.length) {
        return;
      }

      var focusedIndex;

      if (this.state.focusedIndex === null) {
        if (dir === 'next') {
          focusedIndex = 0;
        } else {
          focusedIndex = ops.length - 1;
        }
      } else {
        if (dir === 'next') {
          focusedIndex = ops[this.state.focusedIndex + 1] ? this.state.focusedIndex + 1 : 0;
        } else {
          focusedIndex = this.state.focusedIndex === 0 ? ops.length - 1 : this.state.focusedIndex - 1;
        }
      }

      this.setState({
        focusedIndex: focusedIndex,
      });
    },

    renderResults: function() {
      if (!this.state.results) {
        return <li role="presentation" className="disabled"><a>&nbsp;</a></li>;
      }

      if (!this.state.results.length) {
        return <li role="presentation" className="disabled">
          <a>
            {this.state.isLoading ? '...' : this.props.notFoundView() || 'Not found'}
          </a>
        </li>;
      }

      return this.state.results.map(function(one, i) {
        var className;
        var selected = false;

        if (this.state.isLoading) {
          className = 'disabled';
        } else if (this.state.focusedIndex === i) {
          className = 'active';
          selected = true;
        }

        return <li
            className={className}
            role="presentation"
            key={i}>
          <a
              onClick={this.onClick.bind(this, i)}
              onMouseEnter={this.onMouseEnter.bind(this, i)}
              onMouseLeave={this.onMouseLeave}
              href="#"
              role="listitem"
              aria-selected={selected}>
            {this.props.itemView ? this.props.itemView(one) : one}
          </a>
        </li>;
      }, this);
    },

    render: function() {
      var className = 'dropdown';

      if (this.props.className) {
        className += ' ' + this.props.className;
      }

      if (this.state.isOpen) {
        className += ' open';
      }


      return <div className={className}>
        <input
            type="search"
            className="form-control"
            onFocus={this.onFocus}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            aria-autocomplete="list"
            aria-owns={this.state.listId}
            autoComplete="off"
            placeholder={this.props.placeholder} />
        <ul
            className="dropdown-menu"
            ref="menu"
            role="listbox">
          {this.renderResults()}
        </ul>
      </div>;
    },

  });
}());
