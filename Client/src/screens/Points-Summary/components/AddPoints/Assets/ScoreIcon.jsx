import React from 'react'

const ScoreIcon = () => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="32" 
      height="32" 
      viewBox="0 0 48 48"
    >
      <defs>
        <mask id="ipSScoreboard0">
          <g 
            fill="none" 
            strokeLinejoin="round" 
            strokeWidth="4"
          >
            <rect 
              width="40" 
              height="28" 
              x="4" 
              y="12" 
              fill="#fff" 
              stroke="#fff" 
              rx="3"
            />
            <path 
              stroke="#fff" 
              strokeLinecap="round" 
              d="M14 6v6m20-6v6"
            />
            <path 
              stroke="#000" 
              strokeLinecap="round" 
              d="M10.227 24L15 19.017V33m9-21v28"
            />
            <ellipse 
              cx="34" 
              cy="26" 
              stroke="#000" 
              rx="3" 
              ry="7"
            />
            <path 
              stroke="#fff" 
              strokeLinecap="round" 
              d="M21 12h6m-6 28h6"
            />
          </g>
        </mask>
      </defs>
      <path 
        fill="currentColor" 
        d="M0 0h48v48H0z" 
        mask="url(#ipSScoreboard0)"
      />
    </svg>
  )
}

export default ScoreIcon