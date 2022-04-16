import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../Models/activity';
import NavBar from './navbar';
import ActivityDashbord from '../../features/Activities/dashbord/ActivityDashbord';
import {v4 as uuid} from 'uuid';

function App() {

    const [activities , setactivities] = useState<Activity[]>([]);
    const [selectedActivity , setSelectedActivity] = useState<Activity | undefined>(undefined);
    const [editeMode , SetediteMode ] = useState(false);

      useEffect(() => {
      axios.get<Activity[]>('http://localhost:5000/api/activities').then(Response => {
      setactivities(Response.data);
      })}, [])


      function handleSelectActivity(Id : string){
        setSelectedActivity(activities.find( x=> x.id === Id));
      }
      function handleCAnselSelectActivity(){
        setSelectedActivity(undefined);
      } 

      function handleFormOpen(id ? : string){
        id ? handleSelectActivity(id) : handleCAnselSelectActivity();
        SetediteMode(true);
      }
      function handleFormClose() {
        SetediteMode(false);
      }
      function handleCreateOrEditeActivity(activity : Activity ){
        activity.id ? 
        setactivities([...activities.filter(x=> x.id !== activity.id) , activity])
        : setactivities([...activities , {...activity, id : uuid() }])

        SetediteMode(false);
        setSelectedActivity(activity);
    }

    function handleDeleteActivity(Id :string) {
      setactivities([...activities.filter( x=> x.id !== Id)]);
    }
    

  return (
    <Fragment >
      <NavBar openForm={handleFormOpen} />
        <Container  style={{marginTop: '7em'}}>
            <ActivityDashbord activities={activities} 
             SelectedActivity = {selectedActivity}
             selectActivity = {handleSelectActivity} 
             canselSelcetActivity = {handleCAnselSelectActivity}
             editeMode = {editeMode}
             openForm = {handleFormOpen}
             closeForm = {handleFormClose}
             createOrEdite = {handleCreateOrEditeActivity}
             handleDeleteActivity={handleDeleteActivity}
            />

        </Container>

    </Fragment>
  );
}

export default App;
