import React from 'react';
import { Media, Image } from 'react-bootstrap';

const FeedLoading = () => {

    const loadingCards = [1, 2];
    
    return (
        <div className="mt-5">                
            {
                loadingCards.map(card => (
                    <Media key={card} className="border border-2 p-3 mb-4" style={{ borderRadius: "10px" }}>
                        <Image style={{ backgroundColor: "#d3d3d3", width: "50px", height: "50px" }} roundedCircle/>
                        <Media.Body>
                            <div style={{ backgroundColor: "#d3d3d3", width: "95%", height: "15px", borderRadius: "10px" }} className="mt-1 ml-3 mb-3"></div>
                            <div style={{ backgroundColor: "#d3d3d3", width: "75%", height: "15px", borderRadius: "10px" }} className="mt-1 ml-3 mb-3"></div>
                            <Media className="ml-3 mt-4">
                                <Image style={{ backgroundColor: "#d3d3d3", width: "40px", height: "40px" }} roundedCircle/>
                                    <Media.Body>
                                        <div style={{ backgroundColor: "#d3d3d3", width: "15%", height: "10px", borderRadius: "10px" }} className="mt-1 ml-3 mb-2"></div>
                                        <div style={{ backgroundColor: "#d3d3d3", width: "10%", height: "10px", borderRadius: "10px" }} className="mt-1 ml-3 mb-4"></div>
                                    </Media.Body>
                            </Media>
                            <p style={{ backgroundColor: "#d3d3d3", width: "95%", height: "10px", borderRadius: "10px" }} className="mt-1 ml-3 mb-2"></p>
                            <p style={{ backgroundColor: "#d3d3d3", width: "95%", height: "10px", borderRadius: "10px" }} className="mt-1 ml-3 mb-2"></p>
                            <p style={{ backgroundColor: "#d3d3d3", width: "95%", height: "10px", borderRadius: "10px" }} className="mt-1 ml-3 mb-2"></p>
                            <p style={{ backgroundColor: "#d3d3d3", width: "75%", height: "10px", borderRadius: "10px" }} className="mt-1 ml-3 mb-2"></p>
                        </Media.Body>
                    </Media>
                ))
            }
        </div>
    )
}

export default FeedLoading;