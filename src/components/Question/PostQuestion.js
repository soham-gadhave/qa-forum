import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Session from '../../utils/session';
import { server } from '../../utils/server';

const PostQuestion = (props) => {

    const [text, setText] = useState("");
    const [details, setDetails] = useState("");

    const handleSubmit = event => {
        event.preventDefault()

        const user = Session.getUser();
        server.post('/api/question',
            {
                text: text,
                details: details,
                author: {
                    name: user.firstname + " " + user.lastname,
                    id: user._id
                }
            }
        )
        .then((response) => {
            console.log(response.data)
            props.history.push("/")
        })
        .catch((err) => {
            console.log(err)
        })

    }

    const handleText = event => {
        const text = event.target.value;
        setText(text)
    }

    const handleDetails = event => {
        const details = event.target.value;
        setDetails(details)
    }

    return (
        <div className="container">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="forText">
                    <Form.Label>Question</Form.Label>
                    <Form.Control type="text" placeholder="Ask Anything" onChange={handleText} value={text} />
                    <Form.Text className="text-muted">
                        Be specific while asking a question.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="forDetails">
                    <Form.Label>Details</Form.Label>
                    <Form.Control as="textarea" placeholder="Give us some details" rows={3} onChange={handleDetails} value={details} style={{resize: "none"}} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Post Question
                </Button>
            </Form>
        </div>
    )
}

export default PostQuestion;