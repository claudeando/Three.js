import './style.css'
import * as THREE from 'three'

const canvas = document.createElement('canvas')
canvas.width = 650
canvas.height = 650

window.addEventListener('load', init)

function init() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 100)
  camera.position.z = 5

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(canvas.width, canvas.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  document.body.append(renderer.domElement)

  window.addEventListener('resize', () => {
    camera.aspect = canvas.width / canvas.height
    camera.updateProjectionMatrix()
    renderer.setSize(canvas.width, canvas.heigh)
  })

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

  const clock = new THREE.Clock()

  const animate = () => {
    const elapsedTime = clock.getElapsedTime()

    particles.rotation.x += 0.001

    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
}