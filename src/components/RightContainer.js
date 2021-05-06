import React from 'react';
import { Col } from 'react-bootstrap';

const RightContainer = props => {
    return (
        <Col md={2}>
            { props.children }
        </Col>
    )
}

export default RightContainer;