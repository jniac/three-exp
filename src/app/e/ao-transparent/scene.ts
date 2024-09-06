import { DirectionalLight, EquirectangularReflectionMapping, HemisphereLight, Mesh, MeshPhysicalMaterial, PlaneGeometry, Scene, TorusKnotGeometry } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

import { Ticker } from '@/some-utilz/ticker'

export function createScene(ticker: Ticker) {
  const scene = new Scene()

  const useLights = false
  if (useLights) {
    const sun = new DirectionalLight(0xffffff, 1)
    sun.position.set(0, 3, 1)
    scene.add(sun)

    const sky = new HemisphereLight('#afdbf5', '#845244', 1)
    scene.add(sky)
  }

  new RGBELoader()
    .setPath('https://threejs.org/examples/textures/equirectangular/')
    .loadAsync('pedestrian_overpass_1k.hdr')
    .then(texture => {
      texture.mapping = EquirectangularReflectionMapping
      scene.environmentIntensity = .33
      scene.backgroundBlurriness = 0.5
      scene.environment = texture
      scene.background = texture
    })

  const knot = new Mesh(
    new TorusKnotGeometry(2, 1, 1024, 512),
    new MeshPhysicalMaterial())
  scene.add(knot)

  const glass = new Mesh(
    new PlaneGeometry(10, 10),
    new MeshPhysicalMaterial({
      color: '#d1ddff',
      transmission: 1,
      roughness: 0,
      dispersion: .1,
      ior: 1.5,
    }))
  scene.add(glass)

  ticker.onTick(tick => {
    knot.rotation.x += .5 * tick.deltaTime
    knot.rotation.y += .5 * tick.deltaTime
  })

  return scene
}
