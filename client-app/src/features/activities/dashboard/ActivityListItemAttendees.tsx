import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { List , Image, Popup } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';
import ProfileCard from '../../Profile/ProfileCard';

interface props {
    attendees : Profile[];
}
export default observer(function ActivityListItemAttendees({attendees} : props)
{
    const style = {
        borderColor : 'orange',
        borderWidth: 3
    }
    return(
        <List horizontal>
            {attendees.map(attendee => (
                <Popup
                    hoverable
                    key={attendee.username}
                    trigger={
                        <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`} >
                            <Image
                             size='mini' 
                             circular src={attendee.image || '/assets/user.png'}
                             bordered
                             style={attendee.following ? style : null}
                             />
                        </List.Item>
                    }>
                        <Popup.Content >
                            <ProfileCard profile={attendee} />
                        </Popup.Content>
                </Popup>

                ))}
        </List>
    )
})