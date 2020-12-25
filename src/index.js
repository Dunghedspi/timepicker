import React from 'react'
import timePicker from "./timePicker";
import clock from '../asset/clock.svg';
import "./styles.css";
const TimePicker = React.forwardRef((props, ref) => {
    React.useEffect(()=>{
        new timePicker(document.getElementById("canvasTime"), {}, document.getElementById("time"));
    },[]);
    const showCanvas = ()=>{
       document.getElementById("clockCanvas").style.display="flex";
    };
    const hiddenCanvas = (event) => {
        const canvasOffset = document.getElementById("canvasTime").getBoundingClientRect();
        if(event.pageX<canvasOffset.x || event.pageX > (canvasOffset.x+canvasOffset.width)){
            document.getElementById("clockCanvas").style.display="none";
        }
        if(event.pageY<canvasOffset.y || event.pageY > (canvasOffset.y+canvasOffset.height)){
            document.getElementById("clockCanvas").style.display="none";   
        }
    }
    const {width, height, name} = props;
    return (
        <>
        <div className="container-canvas" id="clockCanvas" onClick={(event)=>{hiddenCanvas(event)}}>
            <div className="timepicker">
                <canvas width={width} height={height} id="canvasTime"></canvas>
            </div>
        </div>
        <div className="canvas-input">
            <input id={"time"} type="text" defaultValue={"--:--"}  ref={ref} name={name} onClick={() => showCanvas()}/>
            <img src={clock} alt="clockIcon" id="clock" onClick={() => showCanvas()}/>
        </div>
        </>
    )
});

export default TimePicker;
