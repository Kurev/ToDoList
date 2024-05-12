import React, { useState, useEffect } from "react";
import './Todo.css';
import { FaRegTrashAlt } from "react-icons/fa";
import { PiNotebookBold } from "react-icons/pi"; 
import { AiFillSchedule } from "react-icons/ai"; 
import { FaCalendarDays } from "react-icons/fa6";
import { TbPencilCheck } from "react-icons/tb"; 
import { AiOutlineCloseCircle } from "react-icons/ai";

function MyComponent() {
    const [activities, setActivities] = useState([]);
    const [inputToDo, setInputToDo] = useState("");
    const [inputTime, setInputTime] = useState("");
    const [result, setResult] = useState("");
    const [showEmojiContainer, setShowEmojiContainer] = useState(false);

    useEffect(() => {
        const savedActivities = JSON.parse(localStorage.getItem('activities'));
        if (savedActivities) {
            setActivities(savedActivities);
        }
    }, []);

    const handleAddActivity = () => {
        if (!inputToDo.trim() || !inputTime.trim()) {
            alert('Please input a valid activity and time!');
            return;
        }
    
        if (activities.length >= 5) {
            alert('😡 Don\'t rush yourself! Limit exceeded (max 5 items)');
            return;
        }
    
        if (activities.some(activity => activity.text.toLowerCase() === inputToDo.toLowerCase())) {
            alert('This activity already exists in the list!');
            return;
        }
    
        const normalizedText = inputToDo.charAt(0).toUpperCase() + inputToDo.slice(1);
        let timeWithAmPm = inputTime;
    
        // Parse inputTime to ensure it's in 12-hour format
        const parsedTime = new Date(`2000-01-01T${inputTime}`);
        timeWithAmPm = parsedTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    
        const newActivity = { text: normalizedText, time: timeWithAmPm, timestamp: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) };
    
        setActivities(prevActivities => [...prevActivities, newActivity]);
        localStorage.setItem('activities', JSON.stringify([...activities, newActivity]));
        setInputToDo("");
        setInputTime("");
        setShowEmojiContainer(false); // Hide emoji container when adding activity
    };

    const removeActivity = (index) => {
        const updatedActivities = [...activities];
        updatedActivities.splice(index, 1);
        setActivities(updatedActivities);
        localStorage.setItem('activities', JSON.stringify(updatedActivities));
    };

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = weekdays[new Date().getDay()];

    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending....");
        const formData = new FormData(event.target);
        formData.append("access_key", "696bc2f3-1bcd-46f6-a00c-e4e6c6a860be");

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setResult("Form Submitted Successfully");
                event.target.reset(); 
            } else {
                console.log("Error", data);
                setResult(data.message); 
            }
        } catch (error) {
            console.error("Error", error);
            setResult("Error submitting form"); 
        }
    };

    const handleEmojiClick = (emoji) => {
        setInputToDo(prevInput => prevInput + " " + emoji);
        setShowEmojiContainer(false);
    };

    const handleCloseEmojiContainer = () => {
        setShowEmojiContainer(false);
    };

    return (
        <div className="ToDo">
            <div className="Schedule">
                <h1>To Do List <TbPencilCheck /></h1>
                <h3><AiFillSchedule />Be Consistent</h3>
                <h3 className='tomorrow'> <FaCalendarDays /> Never Give Up</h3>

                <form onSubmit={onSubmit}>
                    <label className="feedback">Write a feedback</label>
                    <textarea className="text" name="message" rows="6" placeholder='Enter your message' required></textarea>
                    <button type='submit' className='btn dark-btn'>Send</button>
                </form>
                <span>{result}</span>
            </div>
            <div className="ToDo-Container">
                <h1>{currentDay}</h1>
                <div className="input-button">
                    <PiNotebookBold className="note" onClick={() => setShowEmojiContainer(prev => !prev)} /> 
                    <input
                        className="inputlist"
                        type="text" 
                        value={inputToDo} 
                        onChange={e => setInputToDo(e.target.value)} 
                        placeholder="Enter Your to do list" 
                    /> 
                    <input           
                        className="setTime" 
                        type="time" 
                        value={inputTime} 
                        onChange={e => setInputTime(e.target.value)} 
                        placeholder="Set Time" 
                    />
                    <button className="btn" onClick={handleAddActivity}>Submit</button>
                </div>
                <ul>
                    {activities.map((activity, index) => (
                        <li key={index}>
                            <h4 className="nameToDo">{activity.text}</h4>
                            <h4 className="Time">{activity.time}</h4>
                            <h4 className="delete">
                                <FaRegTrashAlt onClick={() => removeActivity(index)} />
                            </h4>
                        </li>
                    ))}
                </ul>
            </div>
            {showEmojiContainer && (
                <div className="emoji-container show">
                    <AiOutlineCloseCircle className="close" onClick={handleCloseEmojiContainer} />
                    <div className="row1">
                        <span onClick={() => handleEmojiClick("😎")}>😎</span>
                        <span onClick={() => handleEmojiClick("🥪")}>🥪</span>
                        <span onClick={() => handleEmojiClick("🚀")}>🚀</span>
                        <span onClick={() => handleEmojiClick("🎵")}>🎵</span>
                        <span onClick={() => handleEmojiClick("📚")}>📚</span>
                        <span onClick={() => handleEmojiClick("💡")}>💡</span>
                    </div>

                    <div className="row2">
                        <span onClick={() => handleEmojiClick("🚌")}>🚌</span>
                        <span onClick={() => handleEmojiClick("🎨")}>🎨</span>
                        <span onClick={() => handleEmojiClick("🎮")}>🎮</span>
                        <span onClick={() => handleEmojiClick("🧹")}>🧹</span>
                        <span onClick={() => handleEmojiClick("🏠")}>🏠</span>
                        <span onClick={() => handleEmojiClick("🚽")}>🚽</span>
                    </div>

                    <div className="row3">
                        <span onClick={() => handleEmojiClick("🚿")}>🚿</span>
                        <span onClick={() => handleEmojiClick("🪥")}>🪥</span>
                        <span onClick={() => handleEmojiClick("🥛")}>🥛</span>
                        <span onClick={() => handleEmojiClick("⏳")}>⏳</span>
                        <span onClick={() => handleEmojiClick("😊")}>😊</span>
                        <span onClick={() => handleEmojiClick("💖")}>💖</span>
                    </div>
                    
                    <div className="row4">
                        <span onClick={() => handleEmojiClick("⭐")}>⭐</span>
                        <span onClick={() => handleEmojiClick("🛏️")}>🛏️</span>
                        <span onClick={() => handleEmojiClick("🏨")}>🏨</span>
                        <span onClick={() => handleEmojiClick("🥹")}>🥹</span>
                        <span onClick={() => handleEmojiClick("🩵")}>🩵</span>
                        <span onClick={() => handleEmojiClick("💦")}>💦</span>
                    </div>

                    <div className="row5">
                        <span onClick={() => handleEmojiClick("💊")}>💊</span>
                        <span onClick={() => handleEmojiClick("💵")}>💵</span>
                        <span onClick={() => handleEmojiClick("📺")}>📺</span>
                        <span onClick={() => handleEmojiClick("💪")}>💪</span>
                        <span onClick={() => handleEmojiClick("💯")}>💯</span>
                        <span onClick={() => handleEmojiClick("✏️")}>✏️</span>
                    </div>  
                    
                </div>
            )}
        </div>
    );
}

export default MyComponent;
