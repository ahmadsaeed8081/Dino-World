// import Typography from "@mui/material/Typography";
// import { styled } from "@mui/system";
import React, { useEffect ,useState , useRef} from 'react';

// import Connect from "./Connect";
// import { useAuthContext } from '../../providers/AuthProvider';
// import Countdown from 'react-countdown';
// import './timer.css';
import './Timer.css';




const Timer =()=>{


  const [timerDays, setTimerDays] = useState('00');
  const [timerHours, setTimerHours] = useState('00');
  const [timerMins, setTimerMins] = useState('00');
  const [timerSec, setTimerSec] = useState('00');

  let interval = useRef();

  const startTimer = () =>{
    const countDownDate = new Date('May 20 2023 00:00:00').getTime();

    interval = setInterval(() => {
     const now = new Date().getTime();
     const distance = countDownDate - now;
     
     const days = Math.floor(distance/(1000*60*60*24));
     const hours = Math.floor(distance % (1000*60*60*24)/(1000*60*60));
     const minutes = Math.floor(distance% (1000*60*60)/(1000*60));
     const seconds = Math.floor(distance%(1000*60)/(1000));

     if(distance<0){
       // stop timer
       clearInterval(interval.current);

     } else{
       //update timer
       setTimerDays(days);
       setTimerHours(hours);
       setTimerMins(minutes);
       setTimerSec(seconds);
     }

      
    }, 1000);
  };
 
  useEffect(()=>{
   startTimer();
   return () => {
   clearInterval(interval.Connect);
   };
  })

//   const { address } = useAuthContext();
    return(
        <div className='timer'>
        <div className="countDown">
        {/* <h2>Time left</h2> */}
        <div className="timer">
          <section className="timer_in" >
            <p>{timerDays}<span>DAYS</span></p>
          </section>
          <span className="dots">:</span>
          <section className="timer_in">
          <p>{timerHours}<span>HOURS</span></p>
          </section>
          <span className="dots">:</span>
          <section className="timer_in">
          <p>{timerMins}<span>MINUTES</span></p>
            
          </section >
          <span className="dots">:</span>
          <section className="timer_in">
          <p>{timerSec}<span>SECONDS</span></p>
          </section >

          
        </div>
 
        </div>
        </div>
    )
}


export default Timer;