import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import QuestionPreview from './Question/QuestionPreview';
import FeedLoading from './Loading/FeedLoading';
import AuthModal from './Auth/AuthModal';
import Session from '../utils/session';
import { server } from '../utils/server';
import settings from '../settings';

const HomePage = props => {

    const [feed, setFeed] = useState([])
    const [qlassified, setQlassified] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    const handleAddQuestion = () => {
        if(Session.isAuthenticated()) {
            setShowModal(false)
            props.history.push('/postquestion')
        }
        else
            setShowModal(true)
    }

    useEffect(() => {
        
        //Handle Response from qa-forum-api
        const handleFeedSuccessResponse = response => {
            setFeed(response.data)
            //get classified questions
            getQlassified(response.data)
        }
        const handleFeedErrorResponse = error => console.log(error)

        //send request to backend for user feed
        const getFeed = () => {
            server.get("/api/feed")
            .then(handleFeedSuccessResponse)
            .catch(handleFeedErrorResponse)
        }
        //get user's feed
        getFeed()

        //Handle Response from qlassifier-api
        const handleQlassifiedSuccessResponse = response => {
            // console.log(response.data);
            setQlassified(response.data)
            setLoading(false)
        }
        const handleQlassifiedErrorResponse = error => console.log(error)
        
        //send feed for qlassification to qlassifier-api
        const getQlassified = async feed => {
            server.post('/classify/', feed, settings.QLASSIFIER_API_URI)
            .then(handleQlassifiedSuccessResponse)
            .catch(handleQlassifiedErrorResponse)
        }

    }, [])

    //  

    return (
        <div className="mt-md-5">
            <>
                <div className="d-flex justify-content-end"><Button onClick={handleAddQuestion} variant="primary" size="sm">+ Ask a Question</Button></div>
                <AuthModal showModal={showModal} setShowModal={setShowModal} />
        	{
        		loading ? 
                    <FeedLoading /> : 
                    feed.filter(question => qlassified.find(qlassifiedQuestion => qlassifiedQuestion.text === question.text).models.LR_TFIDF.type === "Sincere").map(question => <QuestionPreview question={question} />)
        	}
            </>
        </div>
    );
}

export default HomePage;