import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'

function App() {
  const [selectedModule, setSelectedModule] = useState(null)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar selectedModule={selectedModule} onModuleSelect={setSelectedModule} />
      <Dashboard />
    </div>
  )
}

export default App
