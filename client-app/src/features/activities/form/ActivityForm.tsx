import { observer } from 'mobx-react-lite';
import React, {  useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { Formik , Form  } from 'formik';
import {v4 as uuid} from 'uuid';
import * as yup from 'yup';
import MyTextInput from '../../../app/common/Form/MyTextInput';
import MyTextArea from '../../../app/common/Form/MyTextArea';
import MySelectInput from '../../../app/common/Form/MySelectInput';
import { CategortOptions } from '../../../app/common/Options/CategoryOptions';
import MyDateInput from '../../../app/common/Form/MyDateInput';
import '@popperjs/core';
import {  ActivityFormValues } from '../../../app/models/activity';


export default observer(function ActivityForm() {
    const history = useHistory();
    const {activityStore} = useStore();
    const { loadActivity, loadingInitial
         , createActivity , updateActivity} = activityStore;
    const {id} = useParams<{id: string}>();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchima = yup.object({
        title : yup.string().required('Title is Requiered.'),
        description : yup.string().required('Description is Requiered.'),
        category : yup.string().required(),
        date : yup.string().required('Date is Requiered.').nullable(),
        city : yup.string().required(),
        venue : yup.string().required()
    })

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    }, [id, loadActivity]);

    function handleFormsubmit(activity : ActivityFormValues) {
        if (!activity.id) {
            let newactivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newactivity).then(() => history.push(`/activities/${newactivity.id}`))
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

 

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Header content='Activty Details' sub color='teal' />
            <Formik
             validationSchema={validationSchima}
             enableReinitialize 
             initialValues={activity} 
             onSubmit={values => handleFormsubmit(values)}>
                {({  handleSubmit , isValid , isSubmitting, dirty}) =>(
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='title' placeholder='Title' />
                        <MyTextArea rows={3} placeholder='Description'  name='description'  />
                        <MySelectInput options={CategortOptions} placeholder='Category' name='category'  />
                        <MyDateInput
                            placeholderText='Date' 
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                           />
                        <Header content='Location Details' sub color='teal' />   
                        <MyTextInput placeholder='City'  name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />
                        <Button 
                        loading={isSubmitting} disabled={isSubmitting || !dirty || !isValid}
                         floated='right' positive type='submit' content='Submit' />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>

        </Segment>
    )
})