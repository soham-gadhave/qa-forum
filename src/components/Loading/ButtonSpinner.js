import React from 'react';
import { Spinner } from 'react-bootstrap';

const ButtonSpinner = () => {
    return (
        <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
        />
    )
}

export default ButtonSpinner;