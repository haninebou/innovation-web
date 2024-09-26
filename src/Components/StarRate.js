import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";

function StarRate({ rating, setRating }) {
    const [rateColor, setColor] = useState(null);

    return (
      <>
          {[...Array(5)].map((star, index) => {
              const currentRate = index + 1;
              return (
                  <label key={index}>
                      <FaStar 
                          color={currentRate <= (rateColor || rating) ? "black" : "grey"}
                          value={currentRate}
                          onClick={() => setRating(currentRate)}
                          size={25}
                      />
                  </label>
              );
          })}
      </>
    );
}

export default StarRate;
