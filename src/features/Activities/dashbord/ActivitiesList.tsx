import React, { SyntheticEvent, useState } from 'react';
import { Activity } from '../../../app/Models/activity';
import { Button, Item, Label, Segment } from 'semantic-ui-react';

interface Props {
    activities : Activity[];
    selectActivity : (id : string) => void ;
    DeleteActivity : (id : string) => void ;
    submitting : boolean ;
}

export default function ActivitiesList({activities , selectActivity
     , DeleteActivity , submitting} : Props) {

        const [target , setTarget]= useState('');
        function handleDeleteActivity(e : SyntheticEvent<HTMLButtonElement> , id : string){
            setTarget(e.currentTarget.name);
            DeleteActivity(id);
        }

    return(
        <Segment>
            <Item.Group divided>
                {activities.map( activities=>
                <Item key={activities.id}>
                    <Item.Content>
                        <Item.Header as='a' >{activities.title}</Item.Header>
                        <Item.Meta>{activities.date}</Item.Meta>
                        <Item.Description>
                            <div>{activities.description}</div>
                            <div>{activities.city} , {activities.venue} </div>
                        </Item.Description>
                        <Item.Extra>
                            <Button onClick={() => selectActivity(activities.id)} floated='right' content='View' color='blue' />
                            <Button name={activities.id} loading={submitting && target === activities.id} 
                            onClick={(e) => handleDeleteActivity(e , activities.id)} floated='right' content='Delete' color='red' />

                            <Label  basic  content={activities.category} />
                        </Item.Extra>
                    </Item.Content>
                </Item>
                )}
            </Item.Group>
        </Segment>
    )
}