import { PerspectiveCamera, WebGLRenderer, WebGLRenderTarget } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

import { Ticker } from '@/some-utilz/ticker'

import { Message } from '@/some-utilz/message'
import { GTAOPass } from './GTAOPass'
import { createScene } from './scene'

class MyRenderPass extends RenderPass {
  onBeforeRender: (() => void) | null = null
  disableBackground = false
  override render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget,
    readBuffer: WebGLRenderTarget,
    deltaTime: number,
    maskActive: boolean,
  ) {
    this.onBeforeRender?.()
    if (this.disableBackground) {
      const background = this.scene.background
      this.scene.background = null
      super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive)
      this.scene.background = background
    } else {
      super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive)
    }
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

  const orbitControls = new OrbitControls(camera, renderer.domElement)

  const ticker = new Ticker()
  ticker.setActiveDuration(30)
  ticker.requestActivationOnUserInteraction()

  const scene = createScene(ticker)

  const composer = new EffectComposer(renderer)

  const render = new MyRenderPass(scene, camera)
  render.onBeforeRender = () => {
    camera.layers.enableAll()
  }
  composer.addPass(render)

  const ao = new GTAOPass(scene, camera, width, height)
  composer.addPass(ao)

  const output = new OutputPass()
  composer.addPass(output)

  const passes = {
    render,
    ao,
    output,
  }

  ticker.onTick(() => {
    composer.render()
  })

  Message.on('REQUIRE:THREE', m => {
    m.payload = { three }
  })

  const destroy = () => {
    renderer.domElement.remove()
    ticker.destroy()
  }

  const three = { renderer, camera, scene, ticker, passes, destroy }

  return three
}

export type Three = ReturnType<typeof createThree>
