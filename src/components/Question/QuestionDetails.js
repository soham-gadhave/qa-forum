import React, { useState, useEffect } from "react";
import { Button, Media, Form } from 'react-bootstrap';
import Answer from './Answer';
import AuthModal from '../Auth/AuthModal';
import PostAnswer from './PostAnswer';
import ButtonSpinner from '../Loading/ButtonSpinner';
import ProfilePreview from "../Profile/ProfilePreview";
import SessionExpiredModal from '../Auth/SessionExpiredModal';
import Session from '../../utils/session';
import { server } from "../../utils/server";
import { getDate } from "../../utils/utils";
import './styles/QuestionDetails.css';

const QuestionDetails = props => {
    
    const [height, setHeight] = useState(0);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [question, setQuestion] = useState();
    const [answering, setAnswering] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [answerText, setAnswerText] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [postAnswerLoading, setPostAnswerLoading] = useState(false);
    const [error, setError] = useState({
        message: "",
        code: 0
    })

    const id = props.location.pathname.substring(10, props.location.pathname.length);
    const user = Session.getUser() 

    const handleInput = event => {
        setAnswerText(event.target.value);
    }
    
    const handleAnswer = () => {
        if(!Session.isAuthenticated()) {
            setShowModal(true)
            setAnswering(false)
        }
        else
            setAnswering(true)
    }

    const handleDiscardAnswer = () => setAnswering(false)

    const handlePostAnswer = event => {
        event.preventDefault();
        setPostAnswerLoading(true)

        const id = props.location.pathname.substring(10, props.location.pathname.length);
        //If user is not null then proceed else show a modal window saying their session is expired
        if(!user) {
            setSessionExpired(true);
        }

        const data = {
            author: {
                name: user.firstname + " " + user.lastname,
                id: user._id
            },
            text: answerText
        }

        server.post(`/api/question/${id}/answer`, data)
        .then(response => {
            const id = response.data.answers[response.data.answers.length - 1];
            const now = (new Date()).toISOString()
            const answer = {
                _id: id, 
                author: {
                    name: user.firstname + " " + user.lastname,
                    id: user._id
                },
                text: answerText,
                createdAt: now,
                updatedAt: now
            }

            setAnswer(answer, "add")
            setPostAnswerLoading(false);
            setAnswering(false)
        })
        .catch(error => {
            error.response ? setError({
                message: error.response.data.message,
                code: error.response.status
            }) : setError({
                message: error.message,
                code: 500
            }) 
            setPostAnswerLoading(false)
        })
    }

    const handleQuestionText = event => {
        var updatedQuestion = {...question}
        const now = new Date();
        updatedQuestion.updatedAt = now; 
        updatedQuestion.text = event.target.value;
        setQuestion(updatedQuestion);
    } 

    const handleEditQuestion = () => {
        if(!editing) {
            setEditing(true);
            var questionText = document.getElementById("question-textarea");
            setHeight(questionText.offsetHeight + 15);
        }
    }

    const handleDeleteQuestion = () => {
        setDeleteLoading(true)
        server.delete(`/api/question/${question._id}`)
        .then(() => {
            setDeleteLoading(false)
            props.history.push("/")
        })
        .catch(error => console.log("error", error))
    }

    const handleSaveQuestion = () => {
        setSaveLoading(true)
        server.put(`/api/question/${question._id}`, { "text": question.text })
        .then(response => {
            if(response && response.data) {
                console.log(response.data)
                setQuestion(response.data)
                setEditing(false);
                setSaveLoading(false)
            }
        })
        .catch(error => console.log("error", error))
    }

    const handleDiscardQuestion = () => {
        setEditing(false);
    }

    const setAnswer = (answer, action, id = null) => {
        var updatedQuestion = {...question}
        updatedQuestion.answers = [...question.answers]
        var updatedAnswer = null;
        switch(action) {
            case "add"      : updatedQuestion.answers.push(answer)
                              break;
            case "edit"     : updatedAnswer = updatedQuestion.answers.find(answer => answer._id === id)
                              updatedAnswer.text = answer.text;
                              updatedAnswer.updatedAt = answer.updatedAt;
                              break;
            case "delete"   : updatedAnswer = updatedQuestion.answers.find(answer => answer._id === id)
                              updatedQuestion.answers.splice(updatedQuestion.answers.indexOf(updatedAnswer), 1)
                              break;
            default         : console.log("Give proper action");
        }
        
        setQuestion(updatedQuestion)
    }

    useEffect(() => {
        
        const getQuestion = id => {
            server.get(`/api/question/${id.toString()}`)
            .then(response => {
                setQuestion(response.data)
                setLoading(false);
            })
            .catch(error => {
                if(error.response)
                    console.log(error.response, error.response.data);
                else
                    console.log(error.message, error.toJSON())
                setLoading(false);
            })
        }
        
        getQuestion(id);

    }, [])

    return (
        loading ? <div>Loading</div> : (
            <div key="QuestionDetails">
                <Media className="mt-5 ml-2">
                    <ProfilePreview width="60px" height="60px"/>
                    <Media.Body className={editing ? "ml-0" : "ml-3"}>
                        {
                            editing ? (
                                <Form.Control 
                                    as="textarea" 
                                    style={{ height: height }} 
                                    onChange={handleQuestionText} 
                                    value={question.text}
                                    className="ml-0"
                                />
                            ) :
                            <h4 id="question-textarea">{question.text}</h4>
                        }
                        <div className="d-flex justify-content-between align-items-center">
                            <span><small className="" id="question-date">{ getDate(question.createdAt) }</small></span>
                            <div>
                                {
                                    user && user._id === question.author.id ?
                                    !editing ? (
                                        <>
                                            {
                                                user && question.answers.find(answer => answer.author.id === user._id) ? ( 
                                                    <Button variant="primary" size="sm" disabled >
                                                        <span className="ml-1" style={{ fontStyle: "normal" }}>
                                                            Answered 
                                                        </span>
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline-primary" size="sm" onClick={handleAnswer} >
                                                        <i className="bi bi-pen-fill">
                                                            <span className="ml-1" style={{ fontStyle: "normal" }}>
                                                                Answer
                                                            </span>
                                                        </i>
                                                    </Button>
                                                )
                                            }
                                            <Button variant="warning" className="ml-1 text-white" size="sm" onClick={handleEditQuestion}>
                                                <i className="bi bi-pen-fill">
                                                    <span className="ml-1" style={{ fontStyle: "normal" }}>
                                                        Edit
                                                    </span>
                                                </i>
                                            </Button>
                                            <Button variant="danger" className="ml-1" size="sm" onClick={handleDeleteQuestion} disabled={deleteLoading}>
                                            {
                                                deleteLoading ? <ButtonSpinner /> : (
                                                    <i className="bi bi-trash-fill">
                                                        <span className="ml-1" style={{ fontStyle: "normal" }}>
                                                            Delete
                                                        </span>
                                                    </i>
                                                )
                                            }
                                            </Button>
                                        </>
                                    ) : (
                                    <div className="mt-1"> 
                                        <Button size="sm" variant="success" onClick={handleSaveQuestion} className="mr-1" disabled={saveLoading}>
                                            {
                                                saveLoading ? <ButtonSpinner /> : "Save"
                                            }
                                        </Button>
                                        <Button size="sm" variant="warning" onClick={handleDiscardQuestion} className="text-white">
                                            Discard
                                        </Button>
                                    </div> 
                                     ) :
                                        user && question.answers.find(answer => answer.author.id === user._id) ? ( 
                                            <Button variant="primary" size="sm" disabled >
                                                <span className="ml-1" style={{ fontStyle: "normal" }}>
                                                    Answered 
                                                </span>
                                            </Button>
                                        ) : (
                                            <Button variant="outline-primary" size="sm" onClick={handleAnswer} >
                                                <i className="bi bi-pen-fill">
                                                    <span className="ml-1" style={{ fontStyle: "normal" }}>
                                                        Answer
                                                    </span>
                                                </i>
                                            </Button>
                                        )
                                }
                            </div>
                        </div>
                    </Media.Body>
                </Media>
                {
                    answering && !showModal ? (
                        <div className="mt-5">
                            <PostAnswer 
                                onChange={handleInput} 
                                onDiscard={handleDiscardAnswer} 
                                onSubmit={handlePostAnswer}
                                value={answerText}
                                error={error}
                                loading={postAnswerLoading}
                            />
                        </div>
                    ) : null
                }
                <div className="mt-5" key="answers">
                    { 
                        question.answers.map(answer => (
                            <Answer 
                                key={answer._id}
                                answer={answer} 
                                setAnswer={setAnswer}
                                answerText={answerText} 
                                setAnswerText={setAnswerText}
                            />
                        )) 
                    }
                </div>
                <AuthModal showModal={showModal} setShowModal={setShowModal}/>
                <SessionExpiredModal sessionExpired={sessionExpired} setSessionExpired={setSessionExpired}/>
            </div>
        )
    )
}

export default QuestionDetails;