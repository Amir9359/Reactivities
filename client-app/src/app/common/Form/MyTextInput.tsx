import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";

interface props {
    placeholder : string ;
    name : string ; 
    label ?: string;
    type ?: string;
}
export default function MyTextInput(props : props) {
    const[field , meta] = useField(props.name);

    return( 
        <Form.Field error={meta.touched && !!meta.error}>
            <label >{props.label}</label>
            <input {...field} {...props} />
            {meta.touched && meta.error ? (
                <Label basic color="red" >{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}