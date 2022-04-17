import React  from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface Props{
    inverted? : boolean;
    contenet? : string;
}

export default function LoadingComponent({inverted = true , contenet = 'Loading...'} : Props)
{
    return (
        <Dimmer inverted={inverted} active={true} >
            <Loader  content={contenet} />
        </Dimmer>
    )
}