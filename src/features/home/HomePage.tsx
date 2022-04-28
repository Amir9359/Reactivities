import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";

export default function HomePage() {

    return(
      <Segment inverted vertical textAlign="center" className="masthead">
          <Container text>
              <Header as='h1' inverted>
                  <Image src='/assets/Logo.png' size='massive' alt='Logo' style={{marginBottom : 12}}/>
                  Reactivities
              </Header>
              <Header as='h2' content='Wellcome to Reactivities' inverted/>
              <Button as={Link} to='/activities' size="huge" inverted>
                  Take Me to Activities!
              </Button>
          </Container>
      </Segment>
    )
}