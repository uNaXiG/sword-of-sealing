import { lazy, Suspense, useEffect, useState } from 'react'
import MainMenu from './components/MainMenu/MainMenu'
import './App.css'

const BattleScene = lazy(() => import('./features/battle/BattleScene'))

function App() {
  const [isBattle, setIsBattle] = useState(() => window.location.hash === '#battle')

  useEffect(() => {
    const updatePage = () => setIsBattle(window.location.hash === '#battle')
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])

  return isBattle ? <Suspense fallback={<p>正在載入戰場...</p>}><BattleScene /></Suspense> : <MainMenu />
}

export default App
