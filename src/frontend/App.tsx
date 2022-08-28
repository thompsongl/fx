import * as React from 'react';
import { render } from 'react-dom';

interface AppProps {
  name: string;
}

interface AppState {
  time: string;
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      time: null,
    };
  }

  componentDidMount() {
    this.getTime();
    setInterval(this.getTime, 2000);
  }

  render() {
    const { name } = this.props;
    const { time } = this.state;
    return (
      <>
        <h1>{name}</h1>
        <div>{time}</div>
      </>
    );
  }

  private getTime = async () => {
    const response = await fetch('/api/time', { method: 'GET' });
    if (response.ok) {
      this.setState({ time: await response.text() });
    }
  };
}

export function start() {
  const rootElem = document.getElementById('main');
  render(<App name="Hello World" />, rootElem);
}
