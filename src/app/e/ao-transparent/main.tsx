'use client'

import { useEffects } from '@/some-utilz/packages/react/hooks'

import { createThree } from './three'

function ThreeCanvas() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const width = div.clientWidth
    const height = div.clientHeight
    const three = createThree({ width, height })
    yield three
    Object.assign(window, { three })
    div.appendChild(three.renderer.domElement)
  }, [])

  return (
    <div
      ref={ref}
      className='absolute inset-0 bg-[red]'
    />
  )
}

export function Main() {
  return (
    <div className='page'>
      <ThreeCanvas />
      <div className='absolute page'>
        <h1>ao-transparent</h1>
      </div>
    </div>
  )
}