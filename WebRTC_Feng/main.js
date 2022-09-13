let APP_ID='644fcbc57cc5480d84bcf24666bdc315'
//signaling 服務器id

let token =null
//辨識權限
let uid= String(Math.floor(Math.random()*10000))
//user隨機id


let client

let channel
//房間


/*let queryString =window.location.search
let urlParams = new URLSearchParams(queryString)
let roomID= urlParams.get('room')

if(!roomID){
    window.location = 'lobby.html'
}
*/
//沒有ID重新輸入

let localStream


let remoteStream
let peerConnection

let faceCascade


window.onOpenCvReady=async function(){
    console.log('opencv loading')
    cv['onRuntimeInitialized']=async()=>{
        faceCascade =  new cv.CascadeClassifier();
        await faceCascade.load('haarcascade_frontalface_alt.xml');
    }
    
    
}







const servers={
    iceServers:[
        {
            urls:['stun:stun1.l.google.com:19302','stun:stun2.l.google.com:19302']
        }
    ]
    //google公用服務器stun
}

let init = async()=>{
    client= await AgoraRTM.createInstance(APP_ID)
    //Agora建立(signaling 服務器)
    await client.login({uid,token})
    //本機登入
    channel =client.createChannel('roomID')
    //建立房間
    await channel.join()
    //等待加入

    /*user1創造offer => user1設置本機offer => user1傳offer給user2 
    =>user2創造answer並把遠端設置offer 本機設置answer => user2傳answer給user1 => user1設置遠端answer*/

    channel.on('MemberJoined',handleUserJoined)
    //當有人加入時建立user1offer=>candidate,sdp
    channel.on('MemberLeft',handleUserLeft)
    //當channel沒東西時
    
    client.on('MessageFromPeer',handMessageFromPeer)
    //處理offer

    let user1=document.getElementById('user-1')

    //設置本地=相機
    localStream =await navigator.mediaDevices.getUserMedia({
        video:{width:500,height:300},
        audio:false
    })
    //存取相機
    
    user1.srcObject=localStream
    user1.play()

    
    /*const FPS = 24;
    processVideo()
    function processVideo() {
        
            let cap = new cv.VideoCapture(user1)
            let src = new cv.Mat(300,500, cv.CV_8UC4)
            let dst = new cv.Mat(300,500, cv.CV_8UC4);
            let faces = new cv.RectVector();
            let gray = new cv.Mat();
            let begin = Date.now();
            // start processing.
            cap.read(src);
            src.copyTo(dst);
            cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
            
            try{
                faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0);
            }catch(e){

                console.log(e)
                
            }
            
            // draw faces.
            for (let i = 0; i < faces.size(); ++i) {
                let face = faces.get(i);
                let point1 = new cv.Point(face.x, face.y);
                let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
            }
            
            cv.imshow('faceout', dst);
            // schedule the next one.
            let delay = 1000/FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        
    };*/
   
   
}

    


let handleUserLeft = (MemberID)=>{
    document.getElementById('user-2').style.display = 'none'
    //remote的css隱藏視窗

}

let handMessageFromPeer= async(message,MemberID)=>{
    message = JSON.parse(message.text)
    if(message.type=='offer'){
        createAnswer(MemberID,message.offer)
        //確認是user2 設置offer並創造answer回傳
    }
    if(message.type=='answer'){
        addAnswer(message.offer)
    }
        //確認是user1 設置answer
    if(message.type=='candidate'){
        if(peerConnection){
            peerConnection.addIceCandidate(message.candidate)
            //設置對方的candidate
        }
    }
}

let handleUserJoined = async(MemberID)=>{
    console.log('A new user joined the channel:',MemberID)

    createOffer(MemberID)

}


let createPeerConnection = async(MemberID)=>{
    peerConnection= new RTCPeerConnection(servers)
    remoteStream =new MediaStream()

    document.getElementById('user-2').srcObject =remoteStream 
    //設置本地
    document.getElementById('user-2').style.display ='block'
    //開啟user-2視窗 把css效果關掉(隱藏)
    
    if(!localStream){
        localStream =await navigator.mediaDevices.getUserMedia({video:true,audio:false})
        document.getElementById('user-1').srcObject =localStream
    }
    //檢查本機是否有開視訊

    localStream.getTracks().forEach((Track)=>{
        peerConnection.addTrack(Track,localStream)
    })
    //取得本機track 給對方

    peerConnection.ontrack = (event)=>{
        event.streams[0].getTracks().forEach((Track)=>{
            remoteStream.addTrack(Track)
        })
    }
    //當取得遠端的track時
    //放入track(remoteStream)

    peerConnection.onicecandidate =async(event)=>{
        if(event.candidate){
            client.sendMessageToPeer({text:JSON.stringify({'type':'candidate','candidate':event.candidate})},MemberID)
            //本機送出candidate訊息
        }
    }
    //設置本機candidate訊息(ip接口)

}



let createOffer =async (MemberID)=>{
    await createPeerConnection(MemberID)

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    //設置本機sdp訊息(多媒體)

    client.sendMessageToPeer({text:JSON.stringify({'type':'offer','offer':offer})},MemberID)
    //本機送出sdp訊息
}


let createAnswer= async (MemberID,offer)=>{
    await createPeerConnection(MemberID)

    await peerConnection.setRemoteDescription(offer)
    //設置遠端的offer user2
    let answer=await peerConnection.createAnswer()
    //創造answer
    await peerConnection.setLocalDescription(answer)
    //設置本機的offer user2

    client.sendMessageToPeer({text:JSON.stringify({'type':'answer','offer':answer})},MemberID)
    //回answer給user1

}


let addAnswer= async(answer)=>{
    if(!peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer)
        //設置遠端的offer user1
    }
}

let leaveChannel = async() =>{
    await channel.leave()
    await client.logout()
}

window.addEventListener('beforeunload',leaveChannel)
//當視窗被關掉

init()
