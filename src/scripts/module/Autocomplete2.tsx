import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './styles/s.styl';

function nodeInRoot(node, root) {
    while (node) {
        if (node === root) {
            return true;
        }
        node = node.parentNode;
    }

    return false;
}

class Autocomplete extends React.Component<any, any> {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            isOpen: false,
            focusedIndex: null,
            results: null
        };

        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    componentDidUpdate(prevProps, prevState):void {
        if (prevState.isOpen && !this.state.isOpen) {
            this.setState({
                focusedIndex: null,
            });
            document.removeEventListener('click', this.onDocumentClick, false);
        } else if (!prevState.isOpen && this.state.isOpen) {
            document.addEventListener('click', this.onDocumentClick, false);
        }
    }

    componentDidMount():void {
        document.addEventListener('click', this.onDocumentClick, false);
    }

    componentWillUnmount():void {
        document.removeEventListener('click', this.onDocumentClick, false);
    }

    private nodeInRoot(node, root) {
        while (node) {
            if (node === root) {
                return true;
            }
            node = node.parentNode;
        }

        return false;
    }

    private onDocumentClick(e):void {
        if (!this.nodeInRoot(e.target, ReactDOM.findDOMNode(this))) {
            this.setState({
                isOpen: false,
            });
        }
    }

    private onChange(e):void {
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
        } else if (this.props.fetch) {
            this.setState({isLoading: true});

            this.props.fetch(query).then(results => {
                if (results === null || !this.state.isLoading) {
                    return;
                }

                this.setState({
                    isLoading: false,
                    isOpen: true,
                    results: results,
                });
            });
        }
    }

    private onClick(i, e):void {
        e.preventDefault();

        this.select(i);
    }

    private onKeyDown(e):void {
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
            case 32:
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
    }

    private onMouseEnter(i):void {
        this.setState({
            focusedIndex: i
        });
    }

    private onMouseLeave():void {
        this.setState({
            focusedIndex: null
        });
    }

    private onFocus():void {
        if (this.state.results) {
            this.setState({
                isOpen: true
            });
        }
    }

    private select(i):void {
        this.setState({
            isOpen: false,
        });

        if (this.props.onSelect) {
            this.props.onSelect(this.state.results[i]);
        }
    }

    private focusAdjacentOption(dir):void {
        var ops = this.state.results;

        if (!this.state.isOpen) {
            this.setState({
                isOpen: true,
                focusedIndex: 0
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
    }

    private renderResults():JSX.Element[] {
        if (!this.state.results) {
            return <li role="presentation" className="disabled">
                <a>&nbsp;</a>
            </li>;
        }

        if (!this.state.results.length) {
            return <li role="presentation" className="disabled">
                <a>
                    {this.state.isLoading ? '...' : this.props.notFoundView() || 'Not found'}
                </a>
            </li>;
        }

        return this.state.results.map((one, i) => {
            var className;
            var selected = false;

            if (this.state.isLoading) {
                className = 'disabled';
            } else if (this.state.focusedIndex === i) {
                className = 'active';
                selected = true;
            }

            return <li
                className={'dropdown-item ' + className}
                role="presentation"
                key={i}>
                <a
                    onClick={this.onClick.bind(this, i)}
                    onMouseEnter={this.onMouseEnter.bind(this, i)}
                    onMouseLeave={this.onMouseLeave}
                    href="#">
                    {this.props.itemRender ? this.props.itemRender(one) : one.name}
                </a>
            </li>;
        });
    }

    public render():JSX.Element {
        var className = 'autocomplete';

        if (this.props.className) {
            className += ' ' + this.props.className;
        }

        if (this.state.isOpen) {
            className += ' open';
        }

        return <div className={className}>
            <input
                type="search"
                className="autocomplete-input"
                onFocus={this.onFocus}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                placeholder={this.props.placeholder}/>
            <ul
                className="dropdown-menu"
                ref="menu"
            >
                {this.renderResults()}
            </ul>
        </div>;
    }
}

export {Autocomplete};