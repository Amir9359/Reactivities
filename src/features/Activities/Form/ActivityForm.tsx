import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/Models/activity';


interface Props {
    closeForm : () => void;
    activity : Activity | undefined;
    createOredite : (activity : Activity) => void;
}
export default function ActivityForm ({activity : SelectedActivity, closeForm , createOredite } : Props) {

    const initialState = SelectedActivity ?? {
        id : '',
        title : '',
        category : '',
        description : '',
        date : '',
        city: '',
        venue : '',
        
    }
    const [activity , setActivity] = useState(initialState);

    function handleSubmit() {
        createOredite(activity);
    }
    
    function handleInputChange(event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name , value}= event.target;
        setActivity({...activity , [name]:value})
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'  >
                <Form.Input  placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea  placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
                <Form.Input  placeholder='Category' value={activity.category} name='category' onChange={handleInputChange}/>
                <Form.Input  placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
                <Form.Input  placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
                <Form.Input  placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
                <Button type='submit'  content='Submint' positive  floated='right'/>
                <Button onClick={closeForm} type='button' content='Cancel'  floated='right'/>
            </Form>
        </Segment>
    )
}