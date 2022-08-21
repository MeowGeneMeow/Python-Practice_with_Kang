import React from 'react';
import{Button,message} from 'antd';

const constraints = window.constraints ={
    audio:false,
    viseo:true
}

class camera extends React.Component {
    openCamera = async (e) => {
        try{
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log('success');
            this.handleSuccess(stream);
        }catch(e){
            handleError(e);
        }
    }

    handleSuccess = (stream) => {
        const video = this.refs['myVideo'];
        const videoTracks = stream.getVideoTracks();
        console.log('使用的設備是甚麼'+videoTracks[0].label);
        window.stream = stream;
        video.srcObject = stream;
    }


    render(){
        return(
                <div className="container">
                <h1>
                    <span>攝影機範例</span>
                </h1>
                <video className = "video" ref = "myVideo" autiPLay playsInline></video>  
                {/* playsInline代表不讓使用者拖動影片進度條，ref代表引用對象 */}
                <Button onClick={this.openCamera}>打開攝影機</Button>

            </div>
        );
    }

}

export default camera;