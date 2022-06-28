import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityListItemAttendees from './ActivityListItemAttendees';

interface Props {
    activity: Activity
}

export default function ActivityListItem({ activity }: Props) {

    return (
        <Segment.Group>
            <Segment>
            {activity.isCanselled && 
                <Label style={{textAlign : 'center'}}
                color='red' attached='top' content='Canselled'/>}

                <Item.Group>
                    <Item>
                        <Item.Image style={{marginBottom: 5}} size='tiny' circular src={activity.host?.image || '/assets/user.png'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by <Link to={`/profiles/${activity.hostUsername}`}> {activity.host?.username} </Link> </Item.Description>
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color='orange'> 
                                        You are Hosting this Activity
                                    </Label>
                                </Item.Description>
                            )}
                            {!activity.isHost && activity.isGoinng && (
                                <Item.Description>
                                    <Label basic color='green'> 
                                        You are Going to this Activity
                                    </Label>
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(activity.date!, 'dd MMM yyyy h:mm aa')}
                    <Icon name='marker' /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={activity.attendees!} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button 
                    as={Link}
                    to={`/activities/${activity.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </Segment.Group>
    )
}