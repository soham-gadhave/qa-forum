import React from 'react';
// import server from '../../utils/server';
// import Session from '../../utils/session';
import { Image } from 'react-bootstrap';
import profilePicture1 from './images/profile-picture-1.png';

const ProfilePreview = props => {
    
    const width     = props.width ? props.width.toString() : "50px",
          height    = props.height ? props.height.toString() : "50px";

    return (
        <Image src={profilePicture1} roundedCircle thumbnail style={{ width: width, height: height }}/>
    )
}

export default ProfilePreview;