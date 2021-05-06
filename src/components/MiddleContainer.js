import React from 'react';
import { Col } from 'react-bootstrap';

const MiddleContainer = props => {
    return (
        <Col md={8}>
            { props.children }
        </Col>
    )
}

export default MiddleContainer;