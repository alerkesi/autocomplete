import * as React from 'react';

interface IUser {
    lastName: string;
    firstName: string;
    middleName: string;
}

interface IUserListProps {
    users: IUser[];
}

interface IUserListState {
    users: IUser[];
}

class UserList extends React.Component<IUserListProps, IUserListState> {
    constructor() {
        super();

        this.state = {
            users: this.props.users
        };
    }

    public render(): JSX.Element {
        return (
            <ul>
                {this.state.users.map(item => <li>{item.lastName}</li>)}
            </ul>
        );
    }
}

export {UserList};