import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SessionExpiredModal = props => {
    
    return (
        <Modal
            show={props.sessionExpired}
            onHide={() => {props.setSessionExpired(false); props.history.push('/auth/signin')}}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Session Expired
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><Link to="/auth/signin">Sign in</Link> again</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {props.setSessionExpired(false); props.history.push('/auth/signin')}}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default SessionExpiredModal