import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/Models/activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../Form/ActivityForm';
import ActivitiesList from './ActivitiesList';

interface Props {
    activities: Activity[];
    SelectedActivity : Activity | undefined;
    selectActivity : (id : string) => void ;
    canselSelcetActivity : () => void;
    editeMode : boolean;
    openForm : (id :string) => void;
    closeForm : () => void;
    createOrEdite : (activity : Activity) => void;
    handleDeleteActivity : (id : string) => void ;
}

export default function ActivityDashbord ({activities, SelectedActivity ,
     selectActivity , canselSelcetActivity , editeMode , openForm , closeForm , createOrEdite , handleDeleteActivity }: Props)
{
    return (        
        <Grid>
            <Grid.Column width='10' >
                <ActivitiesList activities={activities} selectActivity={selectActivity} DeleteActivity={handleDeleteActivity}
                 />
            </Grid.Column>
            <Grid.Column width='6'>
                {SelectedActivity && !editeMode &&
                <ActivityDetails  activity={SelectedActivity} canselSelcetActivity={canselSelcetActivity} 
                    openForm={openForm} /> }
               
                {editeMode &&   
                <ActivityForm  closeForm={closeForm} activity={SelectedActivity} createOredite={createOrEdite} /> }
            </Grid.Column>
        </Grid>
    )
}