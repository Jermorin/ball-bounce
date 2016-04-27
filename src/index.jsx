require("./main.css");
import React from 'react';
import ReactDOM from 'react-dom';
import Ball from './ball';

export class App extends React.Component {
	render() {
		return (
			<Ball></Ball>
		);
	}
}

ReactDOM.render(<App/>, document.querySelector("#myApp"));
