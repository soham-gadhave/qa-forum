import { useState, useEffect, useReducer } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import authServer from '../../utils/auth-server';
import { Link } from 'react-router-dom';

const Signin = props => {

    
    const reducer = (form, field) => ({ ...form, ...field })
    const initialState = {
        email: "",
        password: ""
    }

    const [form, setForm] = useReducer(reducer, initialState);
    const [status, setStatus] = useState({})
    const [loading, setLoading] = useState(false)

    const handleInput = event => {
        const name = event.target.name;
        const value = event.target.value;
        setForm({
            [name]: value
        })
    }

    const handleSubmit = event => {
        event.preventDefault();
        setLoading(true)
        authServer.post('/api/auth/signin', form)
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

    useEffect(() => {

    })

    return (
        <div className="container d-flex justify-content-center">
            <Form onSubmit={handleSubmit} className="mt-5">
            {
                status.code ? (
                    <Form.Row>
                        <Alert variant={status.code >= 200 && status.code < 400 ? "success" : "danger"} className="w-100 mx-1">
                            {status.code >= 200 && status.code < 400 ? "Succesfully LoggedIn, Redirecting!" : status.message}
                        </Alert>
                    </Form.Row>
                ) : 
                null
            }
                <Form.Group controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Enter email" onChange={handleInput} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Enter Password" onChange={handleInput} />
                </Form.Group>
                <div className="d-flex justify-content-between align-items-center"> 
                    <Link to="/auth/signup" className="text-decoration-none">
                        <small>Don't have an account? <b>SignUp</b></small>
                    </Link>
                    <Button variant="primary" type="submit" disabled={loading} size="sm">
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
                        "Login"
                    }
                    </Button>
                </div>

            </Form>
        </div>
    )
}

export default Signin