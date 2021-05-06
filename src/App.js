import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import Profile from './components/Profile/Profile';
import HomePage from './components/HomePage';
import PostAnswer from './components/Question/PostAnswer';
import PostQuestion from './components/Question/PostQuestion';
import LeftContainer from './components/LeftContainer';
import RightContainer from './components/RightContainer';
import QuestionDetails from './components/Question/QuestionDetails';
import MiddleContainer from './components/MiddleContainer';
import { Row } from 'react-bootstrap';

function App() {

  return (
        <Router>
          <NavBar/>
          <div className="container-fluid">
            <Row>
              <LeftContainer />
              <MiddleContainer>
                <Switch>
                  <Route exact path="/" component={HomePage} />
                  {/* Auth Routes */}
                  <Route exact path="/auth/signup" component={Signup} />
                  <Route exact path="/auth/signin" component={Signin} />
                  {/* User Routes */}
                  <Route exact path="/profile" component={Profile} />
                  {/* Question and Answer Routes Routes */}
                  <Route exact path="/postquestion" component={PostQuestion} />
                  <Route exact path="/question/:id" component={QuestionDetails} />
                  <Route exact path="/question/:id/answer" component={PostAnswer} />
                </Switch>
              </MiddleContainer>
              <RightContainer />
            </Row>
          </div>
        </Router>

  );
}

export default App;