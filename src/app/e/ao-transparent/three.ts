import { PerspectiveCamera, WebGLRenderer, WebGLRenderTarget } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

import { Ticker } from '@/some-utilz/ticker'

import { createScene } from './scene'

class MyRenderPass extends RenderPass {
  onBeforeRender: (() => void) | null = null
  override render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget,
    readBuffer: WebGLRenderTarget,
    deltaTime: number,
    maskActive: boolean,
  ) {
    this.onBeforeRender?.()
    super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive)
  }
}

export function createThree({
  width = window.innerWidth,
  height = window.innerHeight,
}) {
  const renderer = new WebGLRenderer({
  })

  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 8

  const orbitControls = new OrbitControls(camera, document.body)

  const ticker = new Ticker()
  ticker.setActiveDuration(30)
  ticker.requestActivationOnUserInteraction()

  const scene = createScene(ticker)

  const composer = new EffectComposer(renderer)

  const render1 = new MyRenderPass(scene, camera)
  render1.onBeforeRender = () => {
    camera.layers.set(0)
  }
  composer.addPass(render1)

  const render2 = new MyRenderPass(scene, camera)
  render2.onBeforeRender = () => {
    camera.layers.set(1)
  }
  render2.clear = false
  render2.enabled = false
  composer.addPass(render2)

  const ao = new GTAOPass(scene, camera)
  composer.addPass(ao)
  ao.enabled = false

  const output = new OutputPass()
  composer.addPass(output)

  ticker.onTick(() => {
    composer.render()
  })

  const destroy = () => {
    renderer.domElement.remove()
    ticker.destroy()
  }

  return { renderer, camera, scene, ticker, destroy }
}
