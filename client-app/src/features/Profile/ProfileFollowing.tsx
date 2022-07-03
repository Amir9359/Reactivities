import { observer } from "mobx-react-lite";
import React from "react";
import { Card, Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileCard from "./ProfileCard";

export default observer(function ProfileFollowing(){
    const {profileStore} = useStore();
    const {followings , loadingFollwings, profile, activeTab} = profileStore;
 
    return (
        <Tab.Pane loading={loadingFollwings} >
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='user' floated="left" content={activeTab === 3 ? `people following ${profile?.username}` : `people ${profile?.username} is following`} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {followings.map(profile => (
                            <ProfileCard key={profile.username} profile={profile} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})