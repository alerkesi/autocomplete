import * as React from 'react';

interface IItem {
    [index: string]: any;
}

interface IAutocompleteProps {
    items: IItem[];
    searchKeys: string[];
}

interface IAutocompleteState {
    items: IItem[];
    searchPhrase: string;
}

class Autocomplete extends React.Component<IAutocompleteProps, IAutocompleteState> {
    constructor() {
        super();

        this.state = {
            searchPhrase: '',
            items: []
        };

        const searchHash: {[index: string]: IItem};

        this.props.items = this.props.items.map(item => {
            let searchKey: string = '';
            this.props.searchKeys.forEach(key => {
                    if (item[key]) {
                        searchKey += item[key]
                    }
                }
            )
        })
    }

    handleTypeText(searchString: String): void {
        const items = this.props.items;

        this.setState({
            searchPhrase: searchString,
            items: items.filter(item => item[])
        })
    }

    render(): JSX.Element {
        const {items} = this.state;
        return (
            <div>
                <input type="text"/>
                {items.length ?
                <div className="dropDownList">
                    <ul>

                    </ul>
                </div>
                    : null
                    }
            </div>
        )
    }
}

export {Autocomplete};//mystic with export default and {class}