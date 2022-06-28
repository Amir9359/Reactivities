import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Button, Card, Grid, Header, Image, Tab } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/photoUploadWidget";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
 
interface Props{
    profile: Profile;
}
export default observer(function ProfilePhotos({profile}: Props){
    const {profileStore: {isCurrentUser, uploadPhoto ,
         upLoading , loading , setMainPhoto , DeletePhoto}} = useStore();
    const [addPhotoMode , setAddPhotoMode] = useState(false);
    const [target , setTarget] = useState('');

    function handlePhotoUpload(file : Blob){
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }
    function handelSetPhoto(photo : Photo , e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }
    function handelDeletePhoto(photo : Photo , e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        DeletePhoto(photo);
    }

    return (
        <Tab.Pane >
            <Grid >
                <Grid.Column width={16} >
                <Header floated="left" icon='image' content='Photos' />
                {isCurrentUser && (
                    <Button floated="right" basic 
                        content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                        onClick={() => setAddPhotoMode(!addPhotoMode)}
                     />
                )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                            <PhotoUploadWidget uploadPhoto={handlePhotoUpload}  loading={upLoading}/>
                    ): (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map(photo => (
                                <Card key={photo.id} >
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2} >
                                            <Button 
                                                color="green" 
                                                basic 
                                                content="Main"
                                                name={'Main' + photo.id}
                                                disabled={photo.isMain}
                                                loading={target === 'Main' + photo.id && loading}
                                                onClick={e => handelSetPhoto(photo, e)}
                                            />
                                            <Button 
                                                icon='trash' 
                                                basic 
                                                color="red"
                                                name={photo.id}
                                                loading={target === photo.id && loading}
                                                onClick={e => handelDeletePhoto(photo, e)}
                                                disabled={photo.isMain}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})