import React, { SyntheticEvent, useState } from 'react';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function ActivitiesList() {

        const [target , setTarget]= useState('');

        const {activtystore} = useStore();
        const {deleteActivty , loading , activitiesByDate} =activtystore;

        function handleDeleteActivity(e : SyntheticEvent<HTMLButtonElement> , id : string){
            setTarget(e.currentTarget.name);
            deleteActivty(id);
        }

    return(
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map( activities=>
                <Item key={activities.id}>
                    <Item.Content>
                        <Item.Header as='a' >{activities.title}</Item.Header>
                        <Item.Meta>{activities.date}</Item.Meta>
                        <Item.Description>
                            <div>{activities.description}</div>
                            <div>{activities.city} , {activities.venue} </div>
                        </Item.Description>
                        <Item.Extra>
                            <Button onClick={() => activtystore.handleSelectActivity(activities.id)} floated='right' content='View' color='blue' />
                            <Button name={activities.id}
                             loading={loading && target === activities.id} 
                             onClick={(e) => handleDeleteActivity(e , activities.id)}
                             floated='right'
                             content='Delete'
                             color='red' />

                            <Label  basic  content={activities.category} />
                        </Item.Extra>
                    </Item.Content>
                </Item>
                )}
            </Item.Group>
        </Segment>
    )
})