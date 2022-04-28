import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {  Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponents';
import { useStore } from '../../../app/stores/store';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';


export default observer(function ActivityDetails() {
    
  const {activtystore}= useStore();
  const {selectedActivity : activity , loadActivity , Loadingintial} = activtystore;
  const {id} = useParams<{id : string}>();
  useEffect(() => {
    if(id) loadActivity(id);
  }, [id , loadActivity]);

    if(Loadingintial || !activity) return <LoadingComponent />;

    return(          
      <Grid>
        <Grid.Column width={10}>
          <ActivityDetailedHeader activity={activity} />
          <ActivityDetailedInfo activity={activity} />
          <ActivityDetailedChat />
        </Grid.Column>
        <Grid.Column width={6}>
         <ActivityDetailedSidebar />
        </Grid.Column>
      </Grid>
    )
})