import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

const canvas = document.createElement('canvas')
canvas.width = 650
canvas.height = 650

window.addEventListener('load', init)

function init() {

  // basic scene setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 100)
  camera.position.z = 5

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(canvas.width, canvas.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  document.body.append(renderer.domElement)


  // utility setup
  const textureLoader = new THREE.TextureLoader()

  const effectComposer = new EffectComposer(renderer)
  const MyPass = {
    uniforms: {},
    vertexShader: ``,
    fragmentShader: ``,
  }
  const myPass = new ShaderPass(MyPass)
  // effectComposer.addPass(myPass) // remove this comment


  // object declaration
  const particleGeo = new THREE.BufferGeometry()
  const count = 500000
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const particleMat = new THREE.PointsMaterial({
    size: 0.01,
    sizeAttenuation: true
  })
  const particles = new THREE.Points(particleGeo, particleMat)

  scene.add(particles)


  // resize function
  window.addEventListener('resize', () => {
    camera.aspect = canvas.width / canvas.height
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.width, canvas.heigh)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    effectComposer.setSize(canvas.width, canvas.heigh)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })


  // animation loop setup
  const clock = new THREE.Clock()

  const animate = () => {
    const elapsedTime = clock.getElapsedTime()

    particles.rotation.x += 0.001

    controls.update()

    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    effectComposer.render()
  }
  animate()
}