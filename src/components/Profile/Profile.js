import React, { useState, useEffect } from 'react';
import { Row, Col, Tab, Tabs, Card, Badge, Button, Form } from 'react-bootstrap';
import ProfilePreview from './ProfilePreview';
import ButtonSpinner from '../Loading/ButtonSpinner';
import Session from '../../utils/session';
import settings from '../../settings';
import { server } from '../../utils/server';
import { getDate } from "../../utils/utils";

const Profile = props => {

    const [user, setUser] = useState(Session.getUser());
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [activeKey, setActiveKey] = useState("questions");
    const [questions, setQuestions] = useState([]);
    const [answersLoading, setAnswersLoading] = useState(true);
    const [questionsLoading, setQuestionsLoading] = useState(true);
    const [status, setStatus] = useState({
        error: false,
        message: "",
        code: 0
    })
    const [heights, setHeights] = useState({
        firstname: 0,
        lastname: 0,
        email: 0,
        mobile: 0
    })

    const handleEditProfile = () => {
        setEditing(true);
    }

    const handleSaveChanges = () => {
        setLoading(true)
        server.put(`/api/user/${user._id}`, user)
        .then(response => {
            const updatedUser = response.data;
            localStorage.setItem(settings.USER, JSON.stringify(updatedUser))
            setLoading(false)
            setEditing(false)
            setStatus({
                error: false,
                message: "User " + response.message,
                code: response.status
            })
        })
        .catch(error => {
            error.response ? setStatus({
                error: true,
                message: error.response.data.message,
                code: error.response.status
            }) : setStatus({
                error: true,
                message: error.message,
                code: error.toJSON().status
            })
        })
    }

    const handleInput = event => {
        setUser({ 
            ...user, [event.target.name]: event.target.value 
        })
    }

    const getAnswers = () => {
        server.get(`/api/user/${user._id}/answers`)
        .then(response => {
            const answers = response.data;
            setAnswers(answers);
            setAnswersLoading(false)
            setStatus({
                error: false,
                message: "Answers " + response.message,
                code: response.status
            })
        })
        .catch(error => {
            error.response ? setStatus({
                error: true,
                message: error.response.data.message,
                code: error.response.status
            }) : setStatus({
                error: true,
                message: error.message,
                code: error.toJSON().status
            })
        })
    }

    const handleTabs = key => {
        setActiveKey(key);
        if(key === "answers")
            getAnswers();
    }

    useEffect(() => {

        setHeights({
            firstname: document.getElementById("firstname").offsetHeight,
            lastname: document.getElementById("lastname").offsetHeight,
            email: document.getElementById("email").offsetHeight,
            mobile: document.getElementById("mobile").offsetHeight
        });

        const getQuestions = () => {
            server.get(`/api/user/${user._id}/questions`)
            .then(response => {
                const questions = response.data;
                setQuestions(questions);
                setQuestionsLoading(false);
                setStatus({
                    error: false,
                    message: "Questions " + response.message,
                    code: response.status
                })
            })
            .catch(error => {
                error.response ? setStatus({
                    error: true,
                    message: error.response.data.message,
                    code: error.response.status
                }) : setStatus({
                    error: true,
                    message: error.message,
                    code: error.toJSON().status
                })
            })
        }

        getQuestions()
    }, [])

    return (
        <div>
            <Row className="mt-5 d-flex" style={{ minHeight: "250px" }}>
                <Col sm={3}>
                    <ProfilePreview height="200px" width="200px" />
                </Col>
                <Col sm={9}>
                    <Row>
                        <Col sm={9}></Col>
                        <Col sm={3} className="d-flex align-self-start justify-content-end">
                            <Button size="sm" variant="primary" onClick={handleEditProfile}>
                                <i className="bi bi-pencil-fill mr-1" />
                                <span>
                                    Edit Profile
                                </span>
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3}>
                            <label>
                                <span className="text-muted">First name</span>
                                {
                                    !editing ? 
                                        <p id="firstname" className="h5 font-weight-normal">{user.firstname}</p> :
                                        <Form.Control 
                                            as="input"
                                            name="firstname" 
                                            className="mb-2" 
                                            style={{ height: heights.firstname }}
                                            value={user.firstname}
                                            onChange={handleInput}
                                        />
                                }     
                            </label>
                        </Col>
                        <Col sm={3}>
                            <label>
                                <span className="text-muted">Last name</span>
                                {
                                    !editing ?
                                    <p id="lastname" className="h5 font-weight-normal">{user.lastname}</p> :
                                    <Form.Control 
                                        as="input"
                                        name="lastname" 
                                        className="mb-2" 
                                        style={{ height: heights.lastname }}
                                        value={user.lastname}
                                        onChange={handleInput}
                                    />     
                                }
                            </label>
                        </Col>
                        <Col sm={6}>
                            <label>
                                <span className="text-muted">Email</span>
                                {
                                    !editing ?
                                    <p id="email" className="h5 font-weight-normal">{user.email}</p> :
                                    <Form.Control 
                                        as="input"
                                        name="email" 
                                        className="mb-2" 
                                        style={{ height: heights.email }}
                                        value={user.email}
                                        onChange={handleInput}
                                    />     
                                }
                            </label>
                        </Col>
                        <Col sm={3}>
                            <label>
                                <span className="text-muted">Mobile</span>
                                {
                                    !editing ?
                                    <p id="mobile" className="h5 font-weight-normal">{user.mobile}</p> :
                                    <Form.Control 
                                        as="input"
                                        name="mobile" 
                                        className="mb-2" 
                                        style={{ height: heights.mobile }}
                                        value={user.mobile}
                                        onChange={handleInput}
                                    />     
                                }
                            </label>
                        </Col>
                        <Col sm={3}>
                            <label>
                                <span className="text-muted">Plan</span>
                                <p id="plan" className="h5 font-weight-normal text-capitalize">{user.plan.name}</p>     
                            </label>
                        </Col>
                    </Row>
                    {
                        editing ? (
                            <Row>
                                <Col sm={9}></Col>
                                <Col sm={3} className="d-flex align-self-end justify-content-end">
                                    <Button size="sm" variant="success" onClick={handleSaveChanges} disabled={loading}>
                                        {
                                            loading ? <ButtonSpinner /> : (
                                                <>
                                                    <i className="bi bi-check-circle-fill mr-1" />
                                                    <span>
                                                        Save Changes
                                                    </span>
                                                </>
                                            )
                                        }
                                    </Button>
                                </Col>
                            </Row>
                        ) : 
                        null
                    }
                </Col>
            </Row>
            <Tabs
                id="controlled-tab-example"
                activeKey={activeKey}
                onSelect={handleTabs}
                className="mt-3"
            >
                <Tab eventKey="questions" title={<span className="text-dark"><Badge variant="primary" className="mr-1">{!questionsLoading ? questions.length + " " : ""}</Badge> Questions</span>}>
                    {
                        questions.map(question => {
                            return(
                                <Card key={question._id} className="my-3">
                                    <Card.Title className="mb-0">
                                        <h5 className="my-2 mx-2 text-justify">{question.text}</h5>
                                    </Card.Title>
                                    <Card.Footer>
                                        <small>{getDate(question.createdAt)}</small>
                                    </Card.Footer>
                                </Card>
                            ) 
                        })
                    }
                </Tab>
                <Tab eventKey="answers" title={<span className="text-dark"><Badge variant="primary" className="mr-1">{!answersLoading ? answers.length + " "  : ""}</Badge> Answers</span>}>
                    {
                        answers.map(answer => {
                            return(
                                <Card key={answer._id} className="mt-3">
                                    <Card.Body className="p-2">
                                        <p className="mx-2 mb-0 text-justify">{answer.text}</p>
                                    </Card.Body>
                                    <Card.Footer>
                                        <small>{getDate(answer.createdAt)}</small>
                                    </Card.Footer>
                                </Card>
                            ) 
                        })
                    }
                </Tab>
            </Tabs>
        </div>
    )
}

export default Profile;