import { observer } from 'mobx-react-lite';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../Form/ActivityForm';
import ActivitiesList from './ActivitiesList';


export default observer( function  ActivityDashbord ()
{
    const {activtystore} = useStore();
    const {selectedActivity , editeMode } = activtystore;

    return (        
        <Grid>
            <Grid.Column width='10' >
                <ActivitiesList/>
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editeMode &&
                <ActivityDetails  /> }
               
                {editeMode &&   
                <ActivityForm /> }
            </Grid.Column>
        </Grid>
    )
})