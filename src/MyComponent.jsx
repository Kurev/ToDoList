import React, { useState, useEffect } from "react";
import './Todo.css';
import { FaRegTrashAlt } from "react-icons/fa";
import { PiNotebookBold } from "react-icons/pi"; 
import { AiFillSchedule } from "react-icons/ai"; 
import { FaCalendarDays } from "react-icons/fa6";
import { TbPencilCheck } from "react-icons/tb"; 

function MyComponent() {
    // State variables for managing activities, input values, and form submission result
    const [activities, setActivities] = useState([]);
    const [inputToDo, setInputToDo] = useState("");
    const [inputTime, setInputTime] = useState("");
    const [result, setResult] = useState("");

    // Load activities from local storage when the component mounts
    useEffect(() => {
        const savedActivities = JSON.parse(localStorage.getItem('activities'));
        if (savedActivities) {
            setActivities(savedActivities);
        }
    }, []);

    // Function to handle adding a new activity
    const handleAddActivity = () => {
        // Check if input is empty
        if (!inputToDo.trim() || !inputTime.trim() || !/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(inputTime)) {
            alert('Please input a valid activity and time!');
            return;
        }

        // Check if activity limit has been reached
        if (activities.length >= 5) {
            alert('😡 Don\'t rush yourself! Limit exceeded (max 5 items)');
            return;
        }

        // Check if the activity already exists
        if (activities.some(activity => activity.text.toLowerCase() === inputToDo.toLowerCase())) {
            alert('This activity already exists in the list!');
            return;
        }

        // Normalize text and create new activity object
        const normalizedText = inputToDo.charAt(0).toUpperCase() + inputToDo.slice(1);
        const newActivity = { text: normalizedText, time: inputTime, timestamp: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) };

        // Update activities state, save to local storage, and clear input fields
        setActivities(prevActivities => [...prevActivities, newActivity]);
        localStorage.setItem('activities', JSON.stringify([...activities, newActivity]));
        setInputToDo("");
        setInputTime("");
    };

    // Function to remove an activity
    const removeActivity = (index) => {
        const updatedActivities = [...activities];
        updatedActivities.splice(index, 1);
        setActivities(updatedActivities);
        localStorage.setItem('activities', JSON.stringify(updatedActivities));
    };

    // Array of weekdays and current day
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = weekdays[new Date().getDay()];


    // Function to handle form submission
    const onSubmit = async (event) => {
        event.preventDefault();
        setResult("Sending....");
        const formData = new FormData(event.target);
        formData.append("access_key", "696bc2f3-1bcd-46f6-a00c-e4e6c6a860be");

        try {
            // Send form data to web3forms API
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setResult("Form Submitted Successfully");
                event.target.reset(); // Reset form on successful submission
            } else {
                console.log("Error", data);
                setResult(data.message); // Display error message
            }
        } catch (error) {
            console.error("Error", error);
            setResult("Error submitting form"); // Display error message
        }
    };

    // Render the component
    return (
        <div className="ToDo">
            <div className="Schedule">
                {/* Heading and icons */}
                <h1>To Do List <TbPencilCheck /></h1>
                <h3><AiFillSchedule />Be Consistent</h3>
                <h3 className='tomorrow'> <FaCalendarDays /> Never Give Up</h3>

                {/* Form for feedback submission */}
                <form onSubmit={onSubmit}>
                    <label className="feedback">Write a feedback</label>
                    <textarea className="text" name="message" rows="6" placeholder='Enter your message' required></textarea>
                    <button type='submit' className='btn dark-btn'>Send</button>
                </form>
                {/* Display form submission result */}
                <span>{result}</span>
            </div>
            <div className="ToDo-Container">
                {/* Display current day */}
                <h1>{currentDay}</h1>
                <div className="input-button">
                    {/* Icon for activity input */}
                    <PiNotebookBold className="note" /> 
                    {/* Input fields for activity and time */}
                    <input
                        className="inputlist"
                        type="text" 
                        value={inputToDo} 
                        onChange={e => setInputToDo(e.target.value)} 
                        placeholder="Enter Your to do list" 
                    /> 
                    <input           
                        className="setTime" 
                        type="text" 
                        value={inputTime} 
                        onChange={e => setInputTime(e.target.value)} 
                        placeholder="Set Time" 
                    />
                    {/* Button to submit new activity */}
                    <button className="btn" onClick={handleAddActivity}>Submit</button>
                </div>
                {/* Display list of activities */}
                <ul>
                    {activities.map((activity, index) => (
                        <li key={index}>
                            <h4 className="nameToDo">{activity.text}</h4>
                            <h4 className="Time">{activity.time}</h4>
                            <h4 className="delete">
                                {/* Button to remove activity */}
                                <FaRegTrashAlt onClick={() => removeActivity(index)} />
                            </h4>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MyComponent;


