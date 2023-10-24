import React from 'react'

const PublicLayout = ({children}) => {
  return (
    <div>
    <h1>Public layout</h1>
    <div>{children}</div>
</div>
  )
}

export default PublicLayout