import React from "react";

export default class Ball extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			radius: 30,
			position: {x: 0, y: 0},
			velocity: {x: 0, y: 0}
		};
	}

	componentWillMount() {
		const self = this;
		document.addEventListener('click', self.toggle.bind(self), false);
		window.addEventListener('resize', throttle(self.updateWindow.bind(self)), false);
		this.updateWindow();
		this.setState({position: {x: this.maxX / 2, y: this.maxY / 2}});
	}

	updateWindow() {
		var diameter = this.state.radius * 2;
		this.maxX = window.innerWidth - diameter;
		this.maxY = window.innerHeight - diameter;
	}

	pause() {
		this.setState({velocity: {x: 0, y: 0}});
		cancelAnimationFrame(this.frame);
		this.frame = null;
	}

	tick() {
		const position = this.state.position;
		const velocity = this.state.velocity;
		var velX = velocity.x, posX = position.x + velX;
		var velY = velocity.y, posY = position.y + velY;

		if (posX < 0) {
			posX *= -1;
			velX *= -1;
		} else if (posX > this.maxX) {
			posX = 2 * this.maxX - posX;
			velX *= -1;
		}

		if (posY < 0) {
			posY *= -1;
			velY *= -1;
		} else if (posY > this.maxY) {
			posY = 2 * this.maxY - posY;
			velY *= -1;
		}

		this.setState({
			position: {x: posX, y: posY},
			velocity: {x: velX, y: velY}
		});

		this.frame = requestAnimationFrame(this.tick.bind(this));
	}

	toggle() {
		this.frame ? this.pause() : this.tick();
	}

	startDrag(event) {
		this.frame && this.pause();

		var position = this.state.position;
		var startX = event.clientX, insetX = startX - position.x;
		var startY = event.clientY, insetY = startY - position.y;

		var mousemove = function (event) {
			var eventX = event.clientX;
			var eventY = event.clientY;
			this.setState({
				position: {x: eventX - insetX, y: eventY - insetY},
				velocity: {x: eventX - startX, y: eventY - startY}
			});
			startX = eventX;
			startY = eventY;
		}.bind(this);

		var mouseup = function () {
			document.removeEventListener('mousemove', mousemove);
			document.removeEventListener('mouseup', mouseup);
		};

		document.addEventListener('mousemove', mousemove, false);
		document.addEventListener('mouseup', mouseup, false);
	}

	render() {
		console.log('> ball render');
		return (
			<div className="ball" onMouseDown={this.startDrag.bind(this)} style={{
        top: this.state.position.y,
        left: this.state.position.x,
        width: this.state.radius * 2,
        height: this.state.radius * 2,
        borderRadius: this.state.radius
      }}/>
		);
	}
}


const throttle = function(callback, timeout) {
	var timer = null;
	return function() {
		if (!timer) {
			timer = setTimeout(function() {
				callback();
				timer = null;
			}, timeout || 100);
		}
	}
};

const requestAnimationFrame =
	window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	function(callback) {
		return window.setTimeout(callback, 1000 / 60);
	};

const cancelAnimationFrame =
	window.cancelAnimationFrame        ||
	window.webkitCancelAnimationFrame  ||
	window.mozCancelAnimationFrame     ||
	window.oCancelAnimationFrame       ||
	window.msCancelAnimationFrame      ||
	function(token) {
		return window.clearTimeout(token);
	};
