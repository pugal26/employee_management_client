import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import TimeTracking from './components/TimeTracking'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/time' element={<TimeTracking />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App