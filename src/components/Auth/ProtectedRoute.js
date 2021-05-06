import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import Session from '../../utils/session';

const ProtectedRoute = props => {
    const { component: Component, ...rest } = props;
    
    return (
        <Route 
            {...rest} 
            render={props => Session.userSession.isLoggedIn ? <Component {...props} /> : <Redirect to="/auth/signin"/>} 
        />
    )

}

export default ProtectedRoute;