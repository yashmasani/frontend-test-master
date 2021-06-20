import React,{useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import InfoIcon from '@material-ui/icons/Info';
import "./css/ActivityDetail.css";
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';


const ActivityDetail  = (props) => {
  
  const [callDetails, setCallDetails] = useState({})


  // get call details
  const getDetails = async () => {
    
    try{
      const response = await fetch(`https://aircall-job.herokuapp.com/activities/${props.callId}`).then(resp => resp.json())
      setCallDetails(response)
    }catch(err){
      console.log(`Error: ${err}`)
    }


  }

 //close
 const closeOverlay = () =>{
    props.clickInfo(callDetails.id)
 }


 useEffect(()=>{
  
  getDetails();

 },[])
  


  return (
    <div className="overlayInfo">
      
      <HighlightOffOutlinedIcon fontSize="large" onClick={()=>closeOverlay()} className="close"/>
      <p>From: <span>{callDetails.from}</span></p>
      <p>To: <span>{callDetails.to}</span></p>
      <p>Via: <span>{callDetails.via}</span></p>
      <p>Duration: <span>{callDetails.duration} seconds</span></p>
      <p>Direction: <span>{callDetails.direction}</span></p>
      <p>Call Type: <span>{callDetails.call_type}</span></p>
    </div>
  )


}


export default ActivityDetail;
