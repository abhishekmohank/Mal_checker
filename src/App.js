import React, { useState } from "react";
import "./App.css";

const MalChecker = () => {
  const [inputText, setInputText] = useState(""); // To store user input
  const [correction, setCorrection] = useState(""); // To store corrections from the API
  const [suggestions, setSuggestions] = useState([]); // To store word suggestions
  const [misspelledWords, setMisspelledWords] = useState([]); // To store misspelled words

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
        setMisspelledWords(data.misspelledWords || []); // Assuming the backend returns an array of misspelled words
      })
      .catch((error) => console.error("Error verifying text:", error));
  };

  // Function to highlight misspelled words in the input text
  const highlightMisspelled = (text) => {
    let highlightedText = text;
    misspelledWords.forEach((word) => {
      // Use a regular expression to replace the misspelled word with a span tag that applies the red color
      const regEx = new RegExp(`\\b${word}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regEx,
        (match) => `<span class="misspelled">${match}</span>`
      );
    });
    return highlightedText;
  };

  return (
    <div className="container">
      <h1>മലയാളം പ്രവചനം</h1>
      <textarea
        placeholder="Enter or paste text here ....."
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={(e) => e.key === "Enter" && handleVerify()} // Pressing Enter triggers Verify
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
      {/* Render the input text with highlighted misspelled words */}
      <div
        className="highlighted-text"
        dangerouslySetInnerHTML={{
          __html: highlightMisspelled(inputText),
        }}
      ></div>
    </div>
  );
};

export default MalChecker;
