import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AuthModal = props => {
    
    return (
        <Modal
            show={props.showModal}
            onHide={() => props.setShowModal(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Sign up before Answering
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><Link to="/auth/signin">Sign in</Link> or <Link to="/auth/signup">Sign up</Link> to answer this question</p>
                {/* <Form>
                    <Form.Group>
                        <Form.Label>

                        </Form.Label>
                    </Form.Group>
                </Form> */}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => props.setShowModal(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AuthModal