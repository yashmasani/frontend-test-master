import React,{useState,useEffect} from 'react';
import ReactDOM from 'react-dom';
import ActivityDetail from './ActivityDetail.jsx';
import "./css/ActivityFeed.css";
import CallMadeIcon from '@material-ui/icons/CallMade';
import CallMissedIcon from '@material-ui/icons/CallMissed';
import CallMissedOutgoingIcon from '@material-ui/icons/CallMissedOutgoing';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import VoicemailIcon from '@material-ui/icons/Voicemail';
import InfoIcon from '@material-ui/icons/Info';
import ArchiveOutlinedIcon from '@material-ui/icons/ArchiveOutlined';



const ActivityFeed  = (props) =>{
  
  const [callList,setCallList] = useState("");
  const [isClicked, setIsClicked] = useState(false)
  
  const [callId,setCallId] = useState("");


  
  const getCallList = async () =>{

   try{
      const response = await fetch("https://aircall-job.herokuapp.com/activities").then(res=>res.json()).then(resp => {
      
        resp.map((call,i)=>{
          call.created_at = new Date(call.created_at)
        })
        return resp
      });
      setCallList(response);
    }catch(err){
      console.log(err);
    }
    
  
  }

  // setup for activity details 
  const clickInfo = callId  =>{
     
    setIsClicked(!isClicked)
    setCallId(callId)
  }
  

  useEffect(()=>{
    // retrieve call data every change
    getCallList();
    
  },[])


  const checkDate = (key) =>{
    
    if (key == 0){
      return false;
    }
    const prevEntry = callList[key-1].created_at
    const currEntry = callList[key].created_at
    return (prevEntry.getDay()==currEntry.getDay() && prevEntry.getDate()==currEntry.getDate())  
  }

  return (
    <div>
      {isClicked ? <ActivityDetail callId={callId} clickInfo={clickInfo}/> : ""}
      {callList &&  Object.entries(callList).map(([key,call])=>

       (
        <div>{checkDate(key) ? <div></div> : <div className="date-head">{call.created_at.toLocaleDateString('en-US',{weekday:'short',year: 'numeric', month: 'long', day: 'numeric'})}</div> }
         <div key={call.id} className="call">
            <CallComponent direction={call.direction} call_type={call.call_type} className="call-icon"/>
                     <div className="call-dir"><div className="call-from">{call.from}</div><span className="call-to">To: {call.to || "unknown Number"}</span></div>

          <div className="right-side">
           <div className="function-icons"><InfoIcon onClick={()=>clickInfo(call.id)} className="info"/><ArchiveOutlinedIcon className="archive"/></div>
           <span className="created">{call.created_at.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone:"UTC"})}</span>
          </div>
        
         </div>
        </div>)
      )}
    </div>  
  )
}


const CallComponent = ({direction,call_type}) => {
  if (call_type=="missed"){
    if (direction=="inbound"){
      return <CallMissedIcon fontSize="large"/>
    }else{
      return <CallMissedOutgoingIcon fontSize="large"/>
    }
  }

  if(call_type=="answered"){
    if(direction=="inbound"){
      return <CallReceivedIcon fontSize="large"/>
    }else{
      return <CallMadeIcon fontSize="large"/>
    }
  }
  
  if(call_type=="voicemail"){
    if(direction=="inbound"){
      return <div><CallReceivedIcon/><VoicemailIcon fontSize="large"/></div>
    }else{
      return <div><CallMadeIcon/><VoicemailIcon fontSize="large"/></div>
    }
  }
  
  

}


export default ActivityFeed;

