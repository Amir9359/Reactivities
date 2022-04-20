import React, { Fragment, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './navbar';
import ActivityDashbord from '../../features/Activities/dashbord/ActivityDashbord';
import LoadingComponent from './LoadingComponents';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';


function App() {

  const {activtystore} = useStore();

      useEffect(() => { activtystore.loadActivities();
    }, [activtystore])
    
    if( activtystore.Loadingintial ) return <LoadingComponent contenet='Loading App' />
    
  return (
    <>
      <NavBar />
        <Container  style={{marginTop: '7em'}}>
            <ActivityDashbord />
        </Container>
    </>
  );
}

export default observer(App);
