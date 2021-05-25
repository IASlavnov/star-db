import React, { Component } from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import './app.css';

import Header from '../header';
import RandomPlanet from '../random-planet';
import ErrorBoundry from '../error-boundry';
import { PeoplePage, PlanetsPage, StarshipsPage, LoginPage, SecretPage } from '../pages';

import SwapiService from '../../services/swapi-service';
import { SwapiServiceProvider } from '../swapi-service-context';
import DummySwapiService from '../../services/dummy-swapi-service';
import { StarshipDetails } from '../sw-components';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      selectedPerson: null,
      swapiService: new SwapiService(),
      isLoggedIn: false,
    };

    this.onPersonSelected = this.onPersonSelected.bind(this);
    this.onServiceChange = this.onServiceChange.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin() {
    this.setState({
      isLoggedIn: true,
    });
  }

  onPersonSelected(id) {
    this.setState({
      selectedPerson: id,
    });
  }

  onServiceChange() {
    this.setState(({ swapiService }) => {
      const Service = swapiService instanceof SwapiService ?
        DummySwapiService : SwapiService;

      return {
        swapiService: new Service(),
      }
    });
  }

  render() {
    const { isLoggedIn } = this.state;

    return (
        <ErrorBoundry>
          <SwapiServiceProvider value={this.state.swapiService}>
            <Router>
              <div className="stardb-app">

                <Header onServiceChange={this.onServiceChange} />

                <RandomPlanet />

                <Switch>
                  <Route path="/" render={() => <h2>Welcome to StarDB</h2>} exact />
                  {/*<Route path="/people" render={() => <h2>People</h2>} exact />*/}
                  <Route path="/people/:id?" component={PeoplePage} />
                  <Route path="/planets" component={PlanetsPage} />
                  <Route path="/starships" component={StarshipsPage} exact />
                  <Route path="/starships/:id" render={({ match }) => {
                    const { id } = match.params;
                    return <StarshipDetails itemId={id}/>;
                  }} />
                  <Route
                    path="/login"
                    render={() => (
                      <LoginPage
                        isLoggedIn={isLoggedIn}
                        onLogin={this.onLogin}/>
                    )} />
                  <Route path="/secret" render={() => <SecretPage isLoggedIn={isLoggedIn} />} />

                  {/*<Route render={() => <h2>Page not found</h2>} />*/}
                  <Redirect to="/" />
                </Switch>

              </div>
            </Router>
          </SwapiServiceProvider>
        </ErrorBoundry>
    );
  }
}
