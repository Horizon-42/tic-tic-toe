import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square"
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} />;
    }

    render() {
        let rows = [];
        for (let y = 0; y < 3; y++) {
            let cols = [];
            for (let x = 0; x < 3; x++) {
                cols.push(this.renderSquare(y * 3 + x));
            }
            rows.push(<div className="board-row">{cols}</div>)
        }
        for (let y = 0; y < 3; y++) {

        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coord: { x: null, y: null },
            }],
            setpNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.setpNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice(); //创建副本 为什么？简化功能 跟踪数据改变 确定在何时重新渲染
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{ squares: squares, coord: { x: parseInt(i / 3), y: i % 3 }, }]),
            setpNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            history: this.state.history.slice(0, step + 1),
            setpNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.setpNumber];
        const winner = calculateWinner(current.squares);

        // 设置历史步骤跳转
        const moves = history.map((move, step) => { // move 自动生成的标号
            const desc = step ?
                'Go to move #' + step + ',\t(' + move.coord.x + ',' + move.coord.y + ')' : 'Go to game start';
            return (
                // li对象需要key作为唯一标记
                <li key={step}>
                    <button onClick={() => this.jumpTo(step)}>{desc}</button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player:  ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }
    render() {
        return (
            <div>
                <h1>Hello, world!</h1>
                <h2>It is {this.state.date.toLocaleTimeString()}</h2>
            </div>
        );
    }
}


class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true };

        // 事件回调，需要绑定this
        // this.handleClick = this.handleClick.bind(this);
    }

    handleClick = () => {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn //箭头函数 同时用小括号包住函数体，成为函数表达式，可以直接执行
        }));
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                {this.state.isToggleOn ? 'ON' : "OFF"}
            </button>
        );
    }
}

// ========================================

ReactDOM.render(

    <div>
        <Clock />
        <Game />
        <Toggle />
    </div>,

    document.getElementById('root')
);
