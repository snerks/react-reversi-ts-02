import * as React from 'react';

import GamePage from './components/GamePage';

class App extends React.Component<{}, {}> {
  public render() {
    return (
      // <div className="container">
      //   <nav className="navbar navbar-inverse">
      //     <div className="container-fluid">
      //       <div className="navbar-header">
      //         <button
      //           type="button"
      //           className="navbar-toggle collapsed"
      //           data-toggle="collapse"
      //           data-target="#navbar"
      //           aria-expanded="false"
      //           aria-controls="navbar"
      //         >
      //           <span className="sr-only">Toggle navigation</span>
      //           <span className="icon-bar" />
      //           <span className="icon-bar" />
      //           <span className="icon-bar" />
      //         </button>
      //         <a className="navbar-brand" href="#">Reversi TypeScript React Redux</a>
      //       </div>
      //       <div id="navbar" className="navbar-collapse collapse">
      //         <ul className="nav navbar-nav">
      //           <li className="active"><a href="#">Home</a></li>
      //           <li><a href="https://github.com/snerks/react-reversi-ts">Code</a></li>
      //         </ul>
      //       </div>
      //     </div>
      //   </nav>
      //   <div className="text-center" id="game-board">
      //     <GamePage />
      //   </div>
      // </div>

      <div className="container">

        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
          <button className="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>

          <a className="navbar-brand" href="#">Reversi TypeScript React Redux</a>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active"><a className="nav-link" href="#">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="https://github.com/snerks/react-reversi-ts">Code</a></li>
            </ul>
          </div>
        </nav>

        <div className="text-center" id="game-board">
          <GamePage />
        </div>
      </div>
    );
  }
}

export default App;
