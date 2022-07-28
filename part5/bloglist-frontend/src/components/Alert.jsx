import React from 'react'

const Alert = ({ text, color }) => {
    if (!text) return null;
    return (
        <div className={`${color}`}>
            {text}
        </div>
    )
}

export default Alert;