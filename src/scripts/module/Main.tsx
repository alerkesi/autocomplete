import * as React from 'react';

import {Autocomplete, IUser} from './components/autocomplete/Autocomplete';

import './styles/style';

const data: IUser[] = [
    {id: 1, lastName: 'Иванов'},
    {id: 2, lastName: 'Петров'},
    {id: 3, lastName: 'Сидоров'},
    {id: 4, lastName: 'Петрович'},
    {id: 5, lastName: 'Петрован'},
    {id: 6, lastName: 'Петруха'},
    {id: 7, lastName: 'Петрушка'},
    {id: 8, lastName: 'Перышко'},
    {id: 9, lastName: 'Иванищев-Сидорищев'},
    {id: 10, lastName: 'Каколия'}
];

interface IMainState {
    selectedItem: IUser;
}

class Main extends React.Component<any, IMainState> {
    constructor() {
        super();

        this.state = {
            selectedItem: null
        };

        this.valueLink = this.valueLink.bind(this);
    }

    getDataFromServer(search): Promise<any> {
        const regExp = new RegExp(search.toLowerCase());

        return new Promise((resolve, reject) => setTimeout(() =>
            resolve(data.filter(item => regExp.test(item.lastName.toLowerCase()))), 1000)
        );
    }

    valueLink(item: IUser): void {
        this.setState({
            selectedItem: item
        })
    }

    itemRender(item: IUser): JSX.Element {
        return <span>{item.lastName}</span>;
    }

    render(): JSX.Element {
        return (
            <div className='main'>
                {this.state.selectedItem && <span className='selected-item'>{this.state.selectedItem.lastName}</span>}
                <Autocomplete
                    valueLink={this.valueLink}
                    fetch={this.getDataFromServer}
                    itemRender={this.itemRender}
                    placeholder={'Введите фамилию пользователя'}
                />
            </div>
        );
    }
}

export {Main};