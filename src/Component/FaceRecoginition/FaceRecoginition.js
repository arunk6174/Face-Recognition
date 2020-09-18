import React from 'react';
import './FaceRecoginition.css'

const FaceRecoginition = ({ imageUrl , box }) => {
    return(
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id = 'inputimage' alt = '' src={imageUrl} width='500px' height='auto'/>
                <div className='bounding_box' style={{top: box.topRow, right:box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
            </div>
        </div>

    );
}
export default FaceRecoginition;