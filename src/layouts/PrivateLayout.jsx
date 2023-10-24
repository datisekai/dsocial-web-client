import React from 'react'

const PrivateLayout = ({children}) => {
  return (
    <div>
        <h1>Private layout</h1>
        <div>{children}</div>
    </div>
  )
}

export default PrivateLayout