import * as React from 'react';
import ResponseSuccess from './api/ResponseSuccess';

interface IAutocompleteProps {
    valueLink: Function;
    fetch: (search:string) => Promise<ResponseSuccess<any[]>>;
    itemRender: () => React.Component;
}

interface IAutocompleteState {
    items: any[];
}

class Autocomplete extends React.Component<IAutocompleteProps, IAutocompleteState> {
    constructor() {
        super();

        this.state = {
            items: []
        };

    }

    private handleTypeText(searchString: string): void {
        const searchPromise: Promise<ResponseSuccess<any[]>> = this.props.fetch(searchString);

        searchPromise
            .then((response) => {
                //if (response.data === 200) {
                    //if (response.body) {
                    //    this.setState({
                    //        items: response.body
                    //    })
                    //} else if (response.body.length === 0) {
                    //    this.setState({
                    //        items: []
                    //    })
                    //}
                //}
            })
            .catch((e) => console.warn('something wrong fetch', e))
    }

    public render():JSX.Element {
        return (
            <div></div>
        )
    }
}

class AutocompleteItem extends React.Component<any, any> {
    public render(): JSX.Element {
        return (
            <li>{this.props.item}</li>
        )
    }
}

export {AutocompleteItem, Autocomplete};