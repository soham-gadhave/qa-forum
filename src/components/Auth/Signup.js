import { useState, useEffect, useReducer } from 'react';
import { Form, Button, Col, Alert, Spinner } from 'react-bootstrap';
import authServer from '../../utils/auth-server';

const Signup = (props) => {

    const reducer = (form, field) => ({ ...form, ...field })

    const initialForm = {
        email: "",
        password: "",
        mobile: "",
        firstname: "",
        lastname: ""
    }

    const [form, setForm] = useReducer(reducer, initialForm);
    const [status, setStatus] = useState({})
    const [loading, setLoading] = useState(false)

    const handleSubmit = event => {
        event.preventDefault();
        setLoading(true)
        const statusPromise = authServer.post('/api/auth/signup', form)
        statusPromise
        .then(status => {
            setStatus(status)
            if(status.code >= 200 && status.code < 400)
                setTimeout(() => {
                    setLoading(false)
                    props.history.push("/") 
                }, 2000)
            else
                setLoading(false)
        })
    } 

    const handleInput = event => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({ [name]: value });
    }

    useEffect(() => {

    })

    return (
        <div className="container d-flex justify-content-center">
            <Form className="w-50 mt-5" onSubmit={handleSubmit}>
                {
                    status.code ? (
                        <Form.Row>
                            <Alert variant={status.code >= 200 && status.code < 400 ? "success" : "danger"} className="w-100 mx-1">
                                {status.code >= 200 && status.code < 400 ? "Succesfully registered!" : status.message}
                            </Alert>
                        </Form.Row>
                    ) : 
                    null
                }
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control name="email" value={form.email} type="email" placeholder="Enter email" onChange={handleInput} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Row>
                    <Col lg={6}>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="password" value={form.password} type="password" placeholder="Enter Password" onChange={handleInput} />
                        </Form.Group>
                    </Col>
                    <Col lg={6}>
                        <Form.Group controlId="mobile">
                            <Form.Label>Mobile</Form.Label>
                            <Form.Control name="mobile" value={form.mobile} type="text" placeholder="Your Contact number" onChange={handleInput} />
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col lg={6}>
                        <Form.Group controlId="firstname">
                            <Form.Label>Firstname</Form.Label>
                            <Form.Control name="firstname" value={form.firstname} type="text" placeholder="Your Firstname" onChange={handleInput} />
                        </Form.Group>
                    </Col>
                    <Col lg={6}>
                        <Form.Group controlId="lastname">
                            <Form.Label>Lastname</Form.Label>
                            <Form.Control name="lastname" value={form.lastname} type="text" placeholder="Your Lastname" onChange={handleInput} />
                        </Form.Group>
                    </Col>
                </Form.Row>
                <div className="d-flex justify-content-end"> 
                    <Button variant="primary" type="submit" disabled={loading}>
                    {
                        loading ? (
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        ):
                        "Submit"
                    } 
                    </Button>
                </div>
                
            </Form>
        </div>
    )
}

export default Signup