import React from "react";


type Props = {
  title?: string;
};

export function Header({ title }: Props) {
    return (
        <header>
            <h1>{title || 'Default Title'}</h1>
        </header>
    );
}


export class HeaderClass extends React.Component<Props> {
    render(){
        return (
            <header>
                <h1>{this.props.title || 'Default Title'}</h1>
            </header>
        );  
    }
}