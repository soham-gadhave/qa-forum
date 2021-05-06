import React, { useState } from 'react';
import { Modal, Button, Card, Badge, Alert } from 'react-bootstrap';
import ButtonSpinner from '../Loading/ButtonSpinner';
import './styles/UpgradePlan.css';
import Session from '../../utils/session';
import { server } from '../../utils/server';
import settings from '../../settings';

const UpgradePlan = props => {
    
    const [user, setUser] = useState(Session.getUser());
    const [plan, setPlan] = useState(user && user.plan ? user.plan : { "name": "basic", duration: "lifetime", currency: "INR" })
    const [loading, setLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false);
    const [status, setStatus] = useState({
        error: false,
        message: "",
        code: 0
    })

    const handlePayment = async () => {
        
        try {
            const response = await server.post("/api/order", { 
                "payer": {
                    name: user.firstname + " " + user.lastname,
                    id: user._id                    
                }, 
                "plan": plan.name, 
                "duration": plan.duration, 
                "currency": plan.currency })
            setLoading(false);
            const order = response.data;
            console.log(settings.RAZORPAY_KEY_ID)
            const options = {
                "key": settings.RAZORPAY_KEY_ID, 
                "amount": settings.PLANS[plan.name].price[plan.duration],
                "currency": plan.currency,
                "name": settings.RECEIPT_NAME,
                "description": "Upgrade to premium",
                "order_id": order._id,
                "handler": response => {
                    setLoading(true)
                    const payment = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    }
                    server.post(`/api/order/${order._id}/pay`, payment)
                    .then(response => {
                        const order = response.data;
                        if(order.payment_id) {
                            setStatus({
                                error: false,
                                message: "Plan Upgraded Successfully",
                                code: response.status
                            })
                            props.updatePlan(plan, order.payer.id, setUser)
                        }
                        else 
                            setStatus({
                                error: true,
                                message: "Source was not authenticated",
                                code: response.status
                            })
                        setShowAlert(true)
                        setPlan({
                            name: "premium",
                            currency: "INR",
                            duration: "one_month"
                        })
                        setLoading(false)
                    })
                    .catch(error => {
                        setStatus({
                            error: true,
                            message: error.response ? error.response.data.message : error.message,
                            code: error.response ? error.response.status : 500
                        })
                        setShowAlert(true)
                    })
                },
                "prefill": {
                    "name": user.firstname + " " + user.lastname,
                    "email": user.email,
                    "contact": user.mobile
                },
                "theme": {
                    "color": "#3399cc"
                }
            }
            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', response => console.log(response))
            razorpay.open();
        }
        catch(error) {
            error.response ? setStatus({
                error: true,
                message: error.response.data.message,
                code: error.response.status
            }) : setStatus({
                error: true,
                message: error.message,
                code: 500
            })
            setShowAlert(true)
            setLoading(false)
        }
 
    }

    const loadRazorpayScript = () => {
        setLoading(true)
        const razorpayScript = document.getElementById("razorpayScript");
        if(!razorpayScript) {
            var script = document.createElement("script");
            script.id = "razorpayScript";
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.crossOrigin = "";
            document.body.appendChild(script)
            script.onload = handlePayment;
        }
        else
            handlePayment();
    }
    
    const initiatePayment = () => {
        loadRazorpayScript();
    }

    return (
        <>
            { status.message ? 
                <Alert 
                    show={showAlert} 
                    variant={status.error ? "danger": "success"}
                    onClose={() => setShowAlert(false)}
                    dismissible
                >
                    {status.message}
                </Alert> : 
                null 
            }
            <Modal 
                show={props.show} 
                onHide={() => props.setUpgradePlanModal(false)}
                size="md"
                aria-labelledby="contained-upgrade-plan-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Upgrade Plan
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-around">
                        <Card
                            onClick={() => setPlan({ "name": "basic", duration: "lifetime", currency: "INR" })}
                            bg={plan.name === "basic" ? "success" : "light"}
                            text={plan.name === "basic" ? "light" : "dark"}
                            key="basic"
                            className="plan-cards"
                        >
                            <Card.Header>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>QA <strong>Basic</strong></span>
                                    { user && user.plan.name === "basic" ? <Badge variant={plan.name === "basic" ? "light" : "primary" }>Current</Badge> : null}
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>Basic Plan</Card.Title>
                                <Card.Text>
                                    <ul className="ml-4 pl-1">
                                        <li>Limited scroll</li>
                                        <li>Free</li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Card 
                            onClick={() => setPlan({ "name": "premium", duration: "one_month", currency: "INR" })}
                            bg={plan.name === "premium" ? "success" : "light"}
                            text={plan.name === "premium" ? "light" : "dark"}
                            key="premium"
                            className="plan-cards"
                        >
                            <Card.Header>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>QA <strong>Premium</strong></span>
                                    { user && user.plan.name === "premium" ? <Badge variant={plan.name === "premium" ? "light" : "primary" }>Current</Badge> : null}
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>Premium Plan</Card.Title>
                                <Card.Text>
                                    <ul className="ml-4 pl-1">
                                        <li>Infinte scroll</li>
                                        <li><strong>₹</strong>1000 per month</li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {
                        user && user.plan.name === "basic" && plan.name !== "basic" ?
                        <Button className="mr-2" size="sm" onClick={initiatePayment} disabled={loading}>
                            { loading ? <ButtonSpinner loading={loading} /> : "Upgrade" }
                        </Button> :
                        null    
                    }
                    <Button size="sm" onClick={() => props.setUpgradePlanModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UpgradePlan;