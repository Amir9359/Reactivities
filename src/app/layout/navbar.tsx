import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';
import { useStore } from '../stores/store';
 
export default function NavBar() {

    const{activtystore} = useStore();
    return (
            <Menu inverted fixed='top'>
                <Container>
                    <Menu.Item >
                    <img   src='/assets/logo.png' alt='Logo' style={{marginRight: '10px'}}/>
                    Reactivities
                    </Menu.Item>
                    <Menu.Item  name='Activities'/>
                    <Menu.Item>
                        <Button onClick={() => activtystore.openForm()} positive content='Create Activity'  />
                    </Menu.Item>
                </Container>
            </Menu>
    )
}