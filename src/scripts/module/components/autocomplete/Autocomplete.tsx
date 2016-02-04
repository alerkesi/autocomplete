import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './styles/style';

const nodeInRoot: Function = (node, root) => {
    while (node) {
        if (node === root) {
            return true;
        }
        node = node.parentNode;
    }

    return false;
};

const noop: Function = (): void => {};

interface IAutocompleteProps {
    valueLink: Function;
    fetch: (search: string) => Promise<any[]>;
    itemRender?: (item: IUser) => JSX.Element;
    className?: string;
    placeholder?: string;
    notFoundView?: Function;
}

interface IAutocompleteState {
    isLoading?: boolean;
    isOpen?: boolean;
    results?: any[];
    focusedIndex?: number;
    disabled?: boolean;
    typeText?: string;
}

export interface IUser {
    lastName: string;
    id: string|number;
}

class Autocomplete extends React.Component<IAutocompleteProps, IAutocompleteState> {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            isOpen: false,
            focusedIndex: null,
            results: null,
            typeText: ''
        };

        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.select = this.select.bind(this);
    }

    componentDidUpdate(prevProps, prevState): void {
        if (prevState.isOpen && !this.state.isOpen) {
            this.setState({
                focusedIndex: null
            });
        }
    }

    componentWillMount(): void {
        window.addEventListener('blur', this.handleDocumentClick);
        document.addEventListener('click', this.handleDocumentClick);
    }

    componentWillUnmount(): void {
        window.removeEventListener('blur', this.handleDocumentClick);
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleDocumentClick(e): void {
        if (!nodeInRoot(e.target, ReactDOM.findDOMNode(this))) {
            this.setState({
                isOpen: false
            });
        }
    }

    onChange(e): void {
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

            this.props.fetch(query).then((results: any[]): void => {
                if (results === null || !this.state.isLoading) {
                    return;
                }

                this.setState({
                    isLoading: false,
                    isOpen: true,
                    results: results
                });
            });
        }
    }

    onClick(i, e): void {
        e.preventDefault();

        this.select(i);
    }

    onKeyDown(e): void {
        if (this.state.disabled) {
            return;
        }

        switch (e.keyCode) {
            // tab
            case 9:
                if (this.state.focusedIndex !== null) {
                    e.target.value = this.state.results[this.state.focusedIndex].lastName;
                }
                break;

            // enter + space
            case 32:
            case 13:
                if (this.state.focusedIndex !== null) {
                    this.select(this.state.focusedIndex);
                }
                break;

            // escape
            case 27:
                this.setState({
                    isOpen: false
                });
                break;

            // up
            case 38:
                this.focusSiblingOption('prev');
                break;

            // down
            case 40:
                this.focusSiblingOption('next');
                break;

            default:
                return;
        }

        e.preventDefault();
    }

    onMouseEnter(i): void {
        this.setState({
            focusedIndex: i
        });
    }

    onMouseLeave(): void {
        this.setState({
            focusedIndex: null
        });
    }

    onFocus(): void {
        if (this.state.results) {
            this.setState({
                isOpen: true
            });
        }
    }

    select(i): void {
        if (this.props.valueLink) {
            this.props.valueLink(this.state.results[i]);
        }

        this.setState({
            isOpen: false,
            results: null

        });

        this.refs.myInput.value = '';
    }

    focusSiblingOption(dir): void {
        var ops = this.state.results;

        if (!ops || !ops.length) {
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

    render(): JSX.Element {
        let dropDownClassName = 'dropdown-menu';

        if (this.state.isOpen) {
            dropDownClassName += ' is-open';
        }

        return <div className={this.props.className || 'autocomplete'}>
            <input
                ref='myInput'
                type='search'
                className='input'
                onFocus={this.onFocus}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                placeholder={this.props.placeholder}
            />
            <div className={dropDownClassName}>
                <ul className='dropdown-list'>
                    {this.state.results && (this.state.results.length ?
                        this.state.results.map((one, i) => {
                            var className = '';

                            if (this.state.isLoading) {
                                className = 'is-disabled';
                                } else if (this.state.focusedIndex === i) {
                                className = 'is-active';
                                }

                            return <li
                                className={'dropdown-item ' + className}
                                key={i}>
                                <a
                                    className='dropdown-link'
                                    onClick={this.onClick.bind(this, i)}
                                    onMouseEnter={this.onMouseEnter.bind(this, i)}
                                    onMouseLeave={this.onMouseLeave}
                                    href='#'>
                                    {this.props.itemRender ? this.props.itemRender(one) : one.lastName}
                                </a>
                            </li>;
                            })
                        :
                    <li className='disabled' key='0'>
                        <a>
                            {this.state.isLoading ? '...' : this.props.notFoundView && this.props.notFoundView() || 'Not found'}
                        </a>
                    </li>)
                        }
                </ul>
            </div>
        </div>;
    }
}

export {Autocomplete};