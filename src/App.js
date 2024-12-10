import React, { useState } from "react";
import "./App.css";

const MalChecker = () => {
  const [inputText, setInputText] = useState(""); // To store user input
  const [correction, setCorrection] = useState(""); // To store corrections from the API
  const [suggestions, setSuggestions] = useState([]); // To store word suggestions

  // Function to handle text input changes
  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);

    // API call to predict the next word based on the user's input
    if (text.length > 0) {
      fetch(`YOUR_BACKEND_API_URL_FOR_PREDICTION?text=${text}`) // Replace with the backend API for word prediction
        .then((response) => response.json())
        .then((data) => setSuggestions(data.suggestions)) // Update suggestions with data from backend
        .catch((error) => console.error("Error fetching suggestions:", error));
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };

  // Function to handle grammar/spell check when "Verify" is clicked
  const handleVerify = () => {
    fetch("YOUR_BACKEND_API_URL_FOR_GRAMMAR_CHECK", { // Replace with the backend API for grammar check
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type
      },
      body: JSON.stringify({ text: inputText }), // Send user input to the backend
    })
      .then((response) => response.json())
      .then((data) => {
        setCorrection(data.correction || "No corrections needed."); // Update correction with backend response
      })
      .catch((error) => console.error("Error verifying text:", error));
  };

  return (
    <div className="container">
      <h1>Mal Checker</h1>
      <textarea
        placeholder="Enter or paste text here ....."
        value={inputText}
        onChange={handleInputChange}
        className="text-area"
      />
      {suggestions.length > 0 && (
        <div className="suggestions">
          <h3>Suggestions:</h3>
          <ul>
            {suggestions.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={handleVerify} className="verify-button">
        Verify
      </button>
      {correction && (
        <div className="correction">
          <h3>Correction:</h3>
          <p>{correction}</p>
        </div>
      )}
    </div>
  );
};

export default MalChecker;
