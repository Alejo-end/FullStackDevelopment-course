import React, { useState, useImperativeHandle } from 'react' //as instructed in exercise 5.5, using the given Toggle component

const Toggle = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hidden = { display: visible ? 'none' : '' }
  const shown = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hidden}>
        <button onClick={toggleVisibility} >{props.buttonLabel}</button>
      </div>
      <div style={shown}>
        {props.children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  )
})

Toggle.displayName = 'Toggle'

export default Toggle