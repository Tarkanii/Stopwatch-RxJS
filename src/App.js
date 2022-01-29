import { Subject, interval } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [waitClick, setWaitClick] = useState(null);

  useEffect(() => {
    if (isWorking) {
      const unsubscribe$ = new Subject();
      interval(1000)
        .pipe(takeUntil(unsubscribe$))
        .subscribe(() => {
          setTime((val) => val + 1);
        });
      return () => {
        unsubscribe$.next();
        unsubscribe$.complete();
      }; 
    }
  }, [isWorking]);

  function getTime(sec) {
    const minute = 60;
    const hour = minute * 60;

    const hours = Math.floor(sec / hour);
    const minutes = Math.floor((sec % hour) / minute);
    const seconds = Math.floor(sec - hours * hour - minutes * minute);

    return {
      hours: hours.toString(),
      minutes: minutes.toString(),
      seconds: seconds.toString(),
    };
  }
  function toggleStopwacth() {
    setIsWorking((isWorking) => !isWorking);
    if (isWorking) setTime(0);
  }

  function resetStopwacth() {
    if (!isWorking && time === 0) return;
    setTime(0);
    if (!isWorking) setIsWorking(true);
  }

  function waitStopwatch() {
    if (!isWorking) return;
    const currentTime = new Date().getTime();
    if (currentTime - waitClick <= 300) setIsWorking((prevState) => !prevState);
    setWaitClick(currentTime);
  }
  return (
    <div className="App">
      <div className="stopwatch-container">
        <ul className="stopwatch">
          <li>
            <h3 className="title">Hours</h3>
            {getTime(time).hours.padStart(2, "0")}
          </li>
          <li>
            <h3 className="title">Minutes</h3>
            {getTime(time).minutes.padStart(2, "0")}
          </li>
          <li>
            <h3 className="title">Seconds</h3>
            {getTime(time).seconds.padStart(2, "0")}
          </li>
        </ul>
        <ul className="buttons">
          <li>
            <button onClick={toggleStopwacth}>
              {isWorking ? "Stop" : "Start"}
            </button>
          </li>
          <li>
            <button onClick={resetStopwacth}>Reset</button>
          </li>
          <li>
            <button onClick={waitStopwatch}>Wait</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
