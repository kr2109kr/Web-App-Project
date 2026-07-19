import "./Timer.css";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from "./Buttons/PlayButton";
import PauseButton from "./Buttons/PauseButton";
import SettingsButton from "./Buttons/SettingsButton";
import SettingsContext from "./SettingsContext";
import { useContext, useState, useEffect, useRef } from "react";

const red = "#f54e4e";
const green = "#4aecbc"

function Timer() {
    const settingInfo:any = useContext(SettingsContext);

    const [isPaused, setIsPaused] = useState(false);
    const [mode, setMode] = useState('work'); //work/break/null
    const [secondLeft, setSecondLeft]:any = useState(0);

    const secondsLeftRef = useRef(secondLeft);
    const isPauseRef = useRef(isPaused);
    const modeRef = useRef(mode);
    
    function switchMode() {
        const nextMode = modeRef.current === 'work'? 'break' : 'work';
        const nextSeconds = (nextMode === 'work'? settingInfo.workMinutes : settingInfo.breakMinutes) * 60;

        setMode(nextMode);
        modeRef.current = nextMode;
        
        setSecondLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;
    }

    function tick() {
        secondsLeftRef.current--;
        setSecondLeft(secondsLeftRef.current);
    }

    function initTimer() {
        const seconds = settingInfo.workMinutes * 60;
        setSecondLeft(seconds);
        secondsLeftRef.current = seconds;
    }
    
    useEffect(() =>{
        initTimer();

        const interval = setInterval(() => {
            if(isPauseRef.current) {
                return;
            }
            if(secondsLeftRef.current === 0) {
                return switchMode();
            }

            tick();
        }, 1000);
        return () => clearInterval(interval);
    }, [settingInfo]);

    const totalsSeconds = mode === 'work' 
        ? settingInfo.workMinutes * 60 
        : settingInfo.breakMinutes * 60;
    
        const percentage = Math.round((secondLeft / totalsSeconds) * 100);

        const minutes = Math.floor(secondLeft / 60);
        let seconds:any = secondLeft % 60;
        if(seconds < 10) seconds = '0'+seconds;  



    return(
        <div>
            <CircularProgressbar 
            value={percentage} 
            text={`${minutes}:${seconds} `} 
            styles={buildStyles({
            textColor: "#fff",
            pathColor: mode === 'work'? red : green,
            trailColor: 'rgba(255,255,255,.2)'
        })} />
            <div style={{marginTop:'20px'}}>
                {isPaused
                ? <PlayButton onClick={() => {setIsPaused(false); isPauseRef.current = false}}/>
                : <PauseButton onClick={() => {setIsPaused(true); isPauseRef.current = true}} />}
            </div>
            <div style={{marginTop:'20px'}}>
                <SettingsButton onClick={() => {settingInfo.setShowSettings(true)}} />
            </div>
        </div>
    );
}

export default Timer;
