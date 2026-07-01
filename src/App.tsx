/* eslint-disable no-console */
import React from 'react';
import './App.scss';

const NAMES_SEQUENCE = ['Clock-0', 'Clock-4900', 'Clock-8200', 'Clock-1500'];
const START_TIME_STR = '09:32:31';

const getNameByIdx = (ms: number) => {
  const index = Math.floor(ms / 3300) % NAMES_SEQUENCE.length;

  return NAMES_SEQUENCE[index];
};

interface ClockProps {
  name: string;
  appStartTime: number;
}

interface ClockState {
  time: string;
}

class Clock extends React.Component<ClockProps, ClockState> {
  state: ClockState = {
    time: this.formatTime(this.getClockMs()),
  };

  private timerId: number | null = null;

  private lastLoggedSecond: string = '';

  private getStartClockMs(): number {
    const [h, m, s] = START_TIME_STR.split(':').map(Number);

    return (h * 3600 + m * 60 + s) * 1000;
  }

  private getClockMs(): number {
    const elapsed = Date.now() - this.props.appStartTime;

    return this.getStartClockMs() + elapsed;
  }

  private formatTime(totalMs: number): string {
    const date = new Date(totalMs);

    return date.toUTCString().slice(-12, -4);
  }

  componentDidMount() {
    const currentClockMs = this.getClockMs();
    const currentTimeStr = this.formatTime(currentClockMs);

    this.setState({ time: currentTimeStr });
    console.log(currentTimeStr);
    this.lastLoggedSecond = currentTimeStr;

    this.timerId = window.setInterval(() => {
      const updatedClockMs = this.getClockMs();
      const newTimeStr = this.formatTime(updatedClockMs);

      if (newTimeStr !== this.state.time) {
        this.setState({ time: newTimeStr });
      }

      if (newTimeStr !== this.lastLoggedSecond) {
        console.log(newTimeStr);
        this.lastLoggedSecond = newTimeStr;
      }
    }, 100);
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  componentDidUpdate(prevProps: ClockProps) {
    if (this.props.name !== prevProps.name) {
      console.warn(`Renamed from ${prevProps.name} to ${this.props.name}`);
    }
  }

  render() {
    return (
      <div className="Clock">
        <h1 className="Clock__name">{this.props.name}</h1>
        <div className="Clock__time">{this.state.time}</div>
      </div>
    );
  }
}

interface AppState {
  hasClock: boolean;
  clockName: string;
}

export class App extends React.Component<{}, AppState> {
  state: AppState = {
    hasClock: true,
    clockName: 'Clock-0',
  };

  private appTimerId: number | null = null;

  private appStartTime: number = Date.now();

  componentDidMount() {
    this.appTimerId = window.setInterval(() => {
      const elapsed = Date.now() - this.appStartTime;
      const currentName = getNameByIdx(elapsed);

      if (currentName !== this.state.clockName) {
        this.setState({ clockName: currentName });
      }
    }, 100);

    window.addEventListener('click', this.handleLeftClick);
    window.addEventListener('contextmenu', this.handleRightClick);
  }

  componentWillUnmount() {
    if (this.appTimerId) {
      clearInterval(this.appTimerId);
    }

    window.removeEventListener('click', this.handleLeftClick);
    window.removeEventListener('contextmenu', this.handleRightClick);
  }

  private handleLeftClick = () => {
    this.setState({ hasClock: true });
  };

  private handleRightClick = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ hasClock: false });
  };

  render() {
    return (
      <div className="app" style={{ minHeight: '100vh' }}>
        {this.state.hasClock && (
          <Clock name={this.state.clockName} appStartTime={this.appStartTime} />
        )}
      </div>
    );
  }
}

export default App;
