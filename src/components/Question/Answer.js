import React, { useState } from 'react';
import { Card, Row, Badge, Col, Button, Tooltip, OverlayTrigger, Form, Spinner } from 'react-bootstrap';
import Session from '../../utils/session';
import { server } from '../../utils/server'
import ProfilePreview from '../Profile/ProfilePreview';
import './styles/Answer.css'

const Answer = props => {

    const [error, setError] = useState({
        message: "",
        code: 0
    })
    const [height, setHeight] = useState(0);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const answer = props.answer; 
    const date = new Date(answer.createdAt);
    const user = Session.getUser();

    
    const handleEditAnswer = () => {
        if(!editing) {
            setEditing(true)
            var answerText = document.getElementById(user._id);
            setHeight(answerText.offsetHeight + 15);
            props.setAnswerText(answer.text)
        }
    }

    const handleDeleteAnswer = () => {
        setDeleteLoading(true);
        const id = window.location.pathname.substring(10, window.location.pathname.length);
        server.delete(`/api/question/${id}/answer/${answer._id}`)
        .then(response => {
            props.setAnswer(response.data, "delete", response.data._id)
            setDeleteLoading(false)
        })
        .catch(error => setError({ message: error.message, code: error }))
    }
    
    const handleSaveAnswer = () => {
        setLoading(true)
        const id = window.location.pathname.substring(10, window.location.pathname.length);
        server.put(`/api/question/${id}/answer/${answer._id}`, {"text": props.answerText})
        .then(response => {
            if(response.data) {
                props.setAnswer(response.data, "edit", response.data._id)
                props.setAnswerText(response.data.text)
                setEditing(false);
                setLoading(false)
            }
            else
            setError({
                message: "Failed to update, it seems answer does not exist",
                code: 204
            })
            
        })
        .catch(error => setError({ message: error.message, code: error }))        
    }
    
    const handleDiscard = () => {
        setEditing(false);
    }

    const editTooltip = <Tooltip>Edit</Tooltip>

    const deleteTooltip = <Tooltip>Delete</Tooltip>

    return (
        <Card className="my-3" key={answer._id}>
            <Card.Subtitle>
                    <Row className="ml-2">
                        <Col id="answer-profile-preview" xs={2} md={1} className="ml-2 mt-3">
                            <ProfilePreview width="50px" height="50px" />
                        </Col>
                        <Col id="username-date-details" xs={5} md={2} className="ml-1 px-0 w-75">
                            <Badge id="name-badge-pill" pill variant="info" className="d-table">{ answer.author.name }</Badge>
                            <span><small id="answer-date">{ date.getDate() + " " + date.toLocaleDateString('default', { month: 'long' }) + " " + date.getFullYear() }</small></span>
                        </Col>
                        <Col xs={5} md={9} className="d-flex justify-content-end">
                            {
                                user && answer.author.id === user._id ? (
                                    <div className="mt-4">
                                        <OverlayTrigger placement="bottom" overlay={editTooltip}>
                                            <Button size="sm" variant="warning" className="mr-1 text-white" onClick={handleEditAnswer}>
                                                <i className="bi bi-pen-fill"></i>
                                            </Button>
                                        </OverlayTrigger>
                                        <OverlayTrigger placement="bottom" overlay={deleteTooltip} >
                                            
                                            <Button size="sm" variant="danger" className="" onClick={handleDeleteAnswer}>
                                                {
                                                    deleteLoading ? (
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                    ) :
                                                    <i className="bi bi-trash-fill"></i>
                                                }
                                            </Button>
                                        </OverlayTrigger>
                                    </div>    
                                ) : 
                                null 
                            }
                        </Col>
                    </Row>
            </Card.Subtitle>
            {
                editing ? (
                    <Card.Text className="mx-2 mt-0 mb-2">
                        <Form.Control as="textarea" className="" style={{ height: height }} onChange={event => props.setAnswerText(event.target.value)} value={props.answerText}>
                        </Form.Control>
                        <div className="d-flex justify-content-end mt-2">
                            <Button size="sm" variant="warning" className="mr-1 text-white" onClick={handleDiscard}>
                                Discard
                            </Button>
                            <Button size="sm" variant="success" className="" onClick={handleSaveAnswer} disabled={loading}>
                            {
                                loading ? (
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                ) :
                                "Save"
                            }
                            </Button>
                        </div>
                    </Card.Text>
                ) :
                (
                    <Card.Text id={answer.author.id} className="mx-4 my-2">
                        { answer.text }
                    </Card.Text>
                )
            }
            
        </Card>
    )

} 

export default Answer;