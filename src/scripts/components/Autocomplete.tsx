import * as React from 'react';

export default class Autocomplete extends React.Component<any, any> {
    constructor() {
        super();

        this.state = {
            inputText: ''
        }
    }

    public render(): any {
        return (
            <input type="text" />
        )
    }
}