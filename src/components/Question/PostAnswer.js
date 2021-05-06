import React from 'react';
import { Form, Alert, Button, Spinner } from 'react-bootstrap';
import './styles/PostAnswer.css';

const PostAnswer = props => {

    return (
        <Form id="post-answer-form" className="mr-3" onSubmit={props.onSubmit} key="post-answer-form">
            { 
                props.error.message ? ( 
                    <Form.Row>
                        <Alert variant="danger" className="w-100 mx-1">
                            {props.error.message}
                        </Alert>
                    </Form.Row>
                ) :
                null    
            }
            <Form.Group>
                <Form.Control id="answer-text" as="textarea" onChange={props.onChange} value={props.value} placeholder="Write your answer here, stick to the point" ></Form.Control>
            </Form.Group>
            <div className="d-flex justify-content-end">
                <Button variant="danger" size="sm" className="mx-2">
                    <i className="bi bi-trash-fill"><span className="ml-1" onClick={props.onDiscard}>Discard</span></i>
                </Button>
                <Button type="submit" variant="success" size="sm" className="" disabled={props.loading}>
                {
                    props.loading ? (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    ) :
                    <i className="bi bi-check2-circle"><span className="ml-1">Post Answer</span></i>
                }
                </Button>
            </div>
        </Form>
    )
}

export default PostAnswer;