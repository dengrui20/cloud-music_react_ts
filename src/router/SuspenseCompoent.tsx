import React, { Suspense } from 'react'
const SuspenseComponent = (Component: React.FC<{}>) => (props: {}) =>  {
 
  return (
    <Suspense fallback={ null }>
      <Component />
    </Suspense>
  )
} 
export default SuspenseComponent
