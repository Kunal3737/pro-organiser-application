import React from "react";
/* import './App.css'; */
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import Home from "./components/Home/Home";
import Board from "./components/Board/Board";
import Boards from "./components/Boards/Boards";

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/pro-organiser-application" component={Home} />
          <Route path="/createboard" component={Board} />
          <Route path="/:id/:name" component={Boards} />
          <Route render={() => <h2>404 Page Not Found</h2>} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
