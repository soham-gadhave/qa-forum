import React, { useState } from "react";
import './components.css';
import { Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import ProfilePreview from './Profile/ProfilePreview';
import UpgradePlan from './Plan/UpgradePlan';
import Session from '../utils/session';
import settings from '../settings';
import { server } from '../utils/server';
import { withRouter } from 'react-router';

const NavBar = props => {

    const [showUpgradePlanModal, setUpgradePlanModal] = useState(false);

    
    const handleEditProfile = () => {
        props.history.push('/profile')    
    }
    
    const handlePlanUpgrade = () => {
        setUpgradePlanModal(true)
    }
    
    const handleLogout = () => {
        Session.handleLogout();
        props.history.push(window.location.pathname)
    }
    const user = Session.getUser();

    const updatePlan = (plan, userid, setUser) => {
        server.put(`/api/user/${userid}`, { "plan": plan })
        .then(response => {
            const user = response.data;
            localStorage.setItem(settings.USER, JSON.stringify(user))
            setUser(user)
        })
        .catch(console.log)
    }

    return(
        <>
            <Navbar bg="light" expand="lg" className="d-flex align-items-center">
                <Navbar.Brand href="/"><h2 className="ml-md-5">QAForum</h2></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="d-md-flex justify-content-end">
                    <Nav className="">
                    {
                        Session.isAuthenticated() ?
                        
                        <NavDropdown alignRight className="mr-md-5 d-flex align-self-end" title={<ProfilePreview width="50px" height="50px" />} id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">
                            <span>
                                <span className="d-flex justify-content-between align-items-center">
                                    { user.firstname + " " + user.lastname }
                                    <Badge variant="primary ml-2" >{ user.plan.name }</Badge>
                                </span>
                                <p className="mb-0"><small>{user.email}</small></p>
                            </span>
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleEditProfile}>Edit Profile</NavDropdown.Item>
                            <NavDropdown.Item onClick={handlePlanUpgrade}>Upgrade Plan</NavDropdown.Item>
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                         :
                        <>
                            <Nav.Link href="/auth/signup" style={{ fontWeight: "400", fontSize: "1.8rem" }} className="h5 bi bi-person-plus-fill"><span className="ml-2 mr-2" style={{ fontSize: "1.26rem" }}>Sign Up</span></Nav.Link>
                            <Nav.Link href="/auth/signin" style={{ fontWeight: "400", fontSize: "1.8rem" }} className="h5 bi bi-box-arrow-in-right mr-md-5"><span className="ml-2" style={{ fontSize: "1.26rem" }}>Sign In</span></Nav.Link>
                        </>
                    }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <UpgradePlan show={showUpgradePlanModal} setUpgradePlanModal={setUpgradePlanModal} updatePlan={updatePlan}/>
        </>            
    );
}

export default withRouter(NavBar);