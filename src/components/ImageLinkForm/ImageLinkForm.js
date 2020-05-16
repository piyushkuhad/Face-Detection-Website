import React from 'react';

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return(
        <div>
            <p className="f3">
                {'This brain will detect the faces in your pictures'}
            </p>
            <div className="pa4 br3 shadow-5 form-container">
                <input onChange={onInputChange} type="text" className="f4 pa2 w-70 center" placeholder="Enter Image Link"/>
                <button onClick = {onButtonSubmit} style={{border: 'none'}} className="w-30 f4 link ph3 pv2 dib white bg-light-purple pointer">Detect</button>
            </div>
        </div>
    )
}

export default ImageLinkForm;