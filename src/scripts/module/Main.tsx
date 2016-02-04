import * as React from 'react';
import {Autocomplete} from './Autocomplete2';

import './styles/s.styl';

const data = [
    {id: 1, name: 'qqwerty'},
    {id: 2, name: 'qwqerty'},
    {id: 3, name: 'qweqrty'},
    {id: 4, name: 'qwerqty'},
    {id: 5, name: 'qwertqy'},
    {id: 6, name: 'qwertyq'},
    {id: 7, name: 'qawerty'},
    {id: 8, name: 'qwaerty'},
    {id: 9, name: 'asdf'}
];

class Main extends React.Component<any, any> {
    private getDataFromServer(search):Promise<any> {
        const regExp = new RegExp(search);

        return new Promise((resolve, reject) => setTimeout(() =>
            resolve(data.filter(item => regExp.test(item.name))), 1000)
        );
    }

    private linkState():void {

    }

    private itemRender(item):JSX.Element {
        return <span>{item.name}</span>;
    }

    public render():JSX.Element {
        return (
            <div className="main">
                <Autocomplete
                    valueLink={this.linkState}
                    fetch={this.getDataFromServer}
                    itemRender={this.itemRender}
                    placeholder="Введите фамилию пользователя"
                />
            </div>
        );
    }
}

export {Main};