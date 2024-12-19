import React from "react";
import "./Hint.css"; 

const Hint = ({ hint, handleHint, timer }) => {
  return (
    <div className="hint-container">
      
      {hint && (
        <div className="hint-details">
          <div className="hint-column">
            {hint.left.split("\n").map((line, index) => (
              <div key={index} className="hint-row">
                {line}
              </div>
            ))}
          </div>
          <div className="hint-column">
            {hint.right.split("\n").map((line, index) => (
              <div key={index} className="hint-row2">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hint;
