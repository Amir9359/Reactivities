import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams , useHistory, Link} from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponents';
import { useStore } from '../../../app/stores/store';
import {v4 as uuid} from 'uuid';

export default observer(function ActivityForm () {

    const {activtystore} =useStore();
    const { createActivity , UpdateActivity 
        , loading , loadActivity , Loadingintial}= activtystore;
    const {id} = useParams<{id : string}>();
    const history = useHistory();
    

    const [activity , setActivity] = useState({ 
            id : '',
            title : '',
            category : '',
            description : '',
            date : '',
            city: '',
            venue : '',
    });

    useEffect(()=> {
        if(id) loadActivity(id).then( activity => setActivity(activity!))
    }, [id , loadActivity])

    function handleSubmit() {
      if(activity.id.length === 0)
      {
          let newActivity = {
              ...activity,id : uuid()
          }
          createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
      }
      else {
          UpdateActivity(activity).then( ()=> history.push(`/activities/${activity.id}`))
      }
    }
    
    function handleInputChange(event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name , value}= event.target;
        setActivity({...activity , [name]:value})
    }

    if(Loadingintial) return <LoadingComponent  contenet='Loading Activity...'/>

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'  >
                <Form.Input  placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea  placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
                <Form.Input  placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
                <Form.Input  type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
                <Form.Input  placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
                <Form.Input  placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
                <Button loading={loading} type='submit'  content='Submint' positive  floated='right'/>
                <Button as={Link} to='/activities' type='button' content='Cancel'  floated='right'/>
            </Form>
        </Segment>
    )
})