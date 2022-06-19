import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";

interface Props {
    profile : Profile;
}
export default observer(function ProfileCard({profile} :Props)
{
    return (
        <Card as={Link}  to={`/profile/${profile.username}`} >
            <Image src={profile.image || '/assets/user.png'}/>
            <Card.Content>
                <Card.Header >{profile.displayname}</Card.Header>
                <Card.Header >Bio goes here </Card.Header>
            </Card.Content>
            <Card.Content extra>
                <Icon name="user"/>
                200 followers
            </Card.Content>
        </Card>
    )
})