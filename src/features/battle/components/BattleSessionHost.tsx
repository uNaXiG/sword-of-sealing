import { useCallback, useState, type ReactNode } from 'react'

export type BattleSessionHostContext = {
  generation: number
  requestRestart: (sourceGeneration: number) => void
}

export default function BattleSessionHost({
  children,
}: {
  children: (context: BattleSessionHostContext) => ReactNode
}) {
  const [generation, setGeneration] = useState(0)
  const requestRestart = useCallback((sourceGeneration: number) => {
    setGeneration((current) => current === sourceGeneration ? current + 1 : current)
  }, [])

  return children({ generation, requestRestart })
}
