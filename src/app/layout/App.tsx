import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../Models/activity';
import NavBar from './navbar';
import ActivityDashbord from '../../features/Activities/dashbord/ActivityDashbord';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponents';

function App() {

    const [activities , setactivities] = useState<Activity[]>([]);
    const [selectedActivity , setSelectedActivity] = useState<Activity | undefined>(undefined);
    const [editeMode , SetediteMode ] = useState(false);
    const [loading , setLoading] = useState(true);
    const [submitting , setSubmitting] = useState(false);

      useEffect(() => {
     agent.Activities.list().then(Response => {
       let activities : Activity[] = [];
       Response.forEach( activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
       })
      setactivities(activities);
      setLoading(false);
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
          setSubmitting(true);
          if(activity.id) {
            agent.Activities.update(activity).then(() => {
              setactivities([...activities.filter(x=> x.id !== activity.id) , activity])
              setSelectedActivity(activity);
              SetediteMode(false);
              setSubmitting(false);
            })
          }
          else {
            activity.id = uuid();
            agent.Activities.create(activity).then(() => {
              setactivities([...activities , activity])
              setSelectedActivity(activity);
              SetediteMode(false);
              setSubmitting(false);
            })
          }
    }

    function handleDeleteActivity(Id :string) {
      setSubmitting(true);
      agent.Activities.delete(Id).then(() => {

        setactivities([...activities.filter( x=> x.id !== Id)]);
        setSubmitting(false);
      })

    }
    
    if(loading) return <LoadingComponent contenet='Loading App' />
    
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
             submitting={submitting}
            />

        </Container>

    </Fragment>
  );
}

export default App;
