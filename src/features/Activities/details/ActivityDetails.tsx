import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { Activity } from '../../../app/Models/activity';


interface Props {
    activity : Activity;
    canselSelcetActivity : () => void;
    openForm : (id : string ) => void;
}

export default function ActivityDetails({activity , canselSelcetActivity 
  , openForm } : Props) {
    
    return(
            
        <Card fluid>
        <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
        <Card.Content>
          <Card.Header>{activity.title}</Card.Header>
          <Card.Meta>
            <span >{activity.date}</span>
          </Card.Meta>
          <Card.Description>
            {activity.description}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
                <Button.Group widths='2' >
                    <Button onClick={() => openForm(activity.id )} basic color='blue' content='Edit' />
                    <Button onClick={canselSelcetActivity} basic color='grey' content='cansel' />
                </Button.Group>
        </Card.Content>
      </Card>
    )
}