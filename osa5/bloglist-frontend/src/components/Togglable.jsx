import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(refs, () => {
    return { toggleVisibility }
  })

  if (!visible) {
    return (
      <div>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
    )
  }

  return (
    <div>
      {props.children}
      <button onClick={toggleVisibility}>cancel</button>
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

export default Togglable
