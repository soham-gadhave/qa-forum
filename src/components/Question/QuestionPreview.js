// import { useState } from 'react';
import { Media, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProfilePreview from '../Profile/ProfilePreview';

const QuestionPreview = props => {
    const question = props.question;
    const date = new Date(question.createdAt);
    var answer = question.answers.reduce((answer1, answer2) =>  answer1.createdAt > answer2.createdAt ? answer1 : answer2);
    // answerText = answerText.length <= 359 ? answerText : <span>{answerText.substring(0, 350)} <b>...(more)</b></span>;

    return (
        <Link to={"/question/" + question._id} className="text-secondary text-decoration-none">
            <Media key={question._id} className="border border-2 p-3 mb-4 mt-5" style={{ borderRadius: "10px" }}>
                <div className="mt-1">
                    <ProfilePreview width="60px" height="60px" />
                </div>
                <Media.Body>
                    <h4 className="mt-1 ml-3 mb-3">
                        {question.text}
                    </h4>
                    <Media className="ml-3 mt-4">
                            <ProfilePreview width="50px" height="50px" />
                            <div className="ml-0">
                                <p className="ml-1 mb-0">
                                    <Badge pill variant="info" className="text-capitalize">{answer.author.name}</Badge>
                                </p>
                                <p className="ml-2 mt-0">
                                    <small>
                                        { date.getDate() + " " + date.toLocaleDateString('default', { month: 'long' }) + " " + date.getFullYear() }
                                    </small>
                                </p>
                            </div>
                    </Media>
                    <div className="d-flex justify-content-between">
                        <p className="mt-1 ml-4 mb-2 mr-0 pr-0 text-justify" style={{ maxHeight: "150px", overflow: "hidden" }}>
                            {answer.text.toString()}
                        </p>
                        <span className="d-flex align-self-end pl-0" style={{ marginLeft: "1px", marginBottom: "14px" }}>
                            <strong><em>(...more)</em></strong>
                        </span>
                    </div>
                </Media.Body>
            </Media>
        </Link>
    )
}

export default QuestionPreview;