import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponents';
import { useStore } from '../../../app/stores/store';
import ActivitiesList from './ActivitiesList';


export default observer( function  ActivityDashbord ()
{
    const {activtystore} = useStore();
    const {loadActivities , ActivityRegistery } = activtystore;

    useEffect(() => { if(ActivityRegistery.size <= 1) loadActivities(); }, [ActivityRegistery.size , loadActivities])

    if( activtystore.Loadingintial ) return <LoadingComponent contenet='Loading App...' />
    return (        
        <Grid>
            <Grid.Column width='10' >
                <ActivitiesList/>
            </Grid.Column>
            <Grid.Column width='6'>
                <h2>Activity Filter</h2>
            </Grid.Column>
        </Grid>
    )
})