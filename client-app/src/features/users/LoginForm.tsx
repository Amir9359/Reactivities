import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/Form/MyTextInput";
import { useStore } from "../../app/stores/store";

export default observer(function LoginForm(){
    const {userStore} = useStore();
    return(
        <Formik 
            initialValues={{email:'', password:'' , error: null}}
            onSubmit={(values , {setErrors}) => userStore.login(values).catch(error =>
                 setErrors({error : "Invalide Email or password"}))}
        >
            {({handleSubmit , isSubmitting ,errors }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' color='teal' textAlign='center' content='Login to Activities' /> 
                    <MyTextInput name="email" placeholder="Email" />
                    <MyTextInput name="password" placeholder="Password" type="password" />
                    <ErrorMessage
                        name="error" render={() => 
                         <Label  style={{marginBottom : 10}} basic color='red' content={errors.error} />}/>
                    <Button loading={isSubmitting} positive content="Submit" type='submit' fluid />
                </Form>
            )}

        </Formik>
    )
})