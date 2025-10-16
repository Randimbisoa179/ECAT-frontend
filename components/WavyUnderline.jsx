// components/WavyUnderline.jsx
import React from 'react';

const WavyUnderline = ({ width = "100%", height = "12px" }) => {
     const startColor = "#fe757c";
     const endColor = "#c46ab1";

     return (
          <div
               className="absolute bottom-[-10px] left-0"
               style={{ width, height }}
          >
               <svg
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    width="100%"
                    height="100%"
                    xmlns="http://www.w3.org/2000/svg"
               >
                    <defs>
                         <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" style={{ stopColor: startColor, stopOpacity: 1 }} />
                              <stop offset="100%" style={{ stopColor: endColor, stopOpacity: 1 }} />
                         </linearGradient>
                    </defs>

                    <path
                         d="M 0 5 C 25 15 75 -5 100 5"
                         stroke="url(#gradient-line)"
                         fill="none"
                         strokeWidth="2.5"
                    />
               </svg>
          </div>
     );
};

export default WavyUnderline;
