import React from 'react';

const FaceRecognition = ({imageUrl, box}) => {
    const {leftCol, topRow, rightCol, bottomRow} = box;
    return(
        <div className="center ma">
            <div className="mt2 center" style={{position: "relative", width: '500px'}}>
                <img id="inputimage" src={imageUrl} alt="Result" width="500px" height="auto"/>

                <div className="bounding-box" style={{top: topRow + "px", right: rightCol + "px", bottom: bottomRow + "px", left: leftCol + "px"}}></div>
            </div>
        </div>
    )
}

export default FaceRecognition;