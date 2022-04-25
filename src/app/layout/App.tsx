import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './navbar';
import ActivityDashbord from '../../features/Activities/dashbord/ActivityDashbord';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/Activities/Form/ActivityForm';
import ActivityDetails from '../../features/Activities/details/ActivityDetails';


function App() {
  const location = useLocation();
   
  return (
    <>
          <Route exact path='/' component={HomePage} />
          <Route path='/(.+)' render={() => (
              <>
                  <NavBar />
                  <Container  style={{marginTop: '7em'}}>
                    <Route exact path='/activities' component={ActivityDashbord} />
                    <Route path='/activities/:id' component={ActivityDetails} />
                    <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
                  </Container>
            </>
          )}/>
    </>
  );
}

export default observer(App);
