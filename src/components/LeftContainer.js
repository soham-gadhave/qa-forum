import React from 'react';
import { Col } from 'react-bootstrap';

const LeftContainer = props => {
    return (
        <Col md={2}>
            { props.chlidren }
        </Col>
    )
}

export default LeftContainer;