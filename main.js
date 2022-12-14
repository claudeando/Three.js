import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import gsap from 'gsap'

const canvas = document.createElement('canvas')
canvas.width = 650
canvas.height = 650

window.addEventListener('load', init)

function init() {

  // basic scene setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, canvas.width / canvas.height, 0.1, 100)
  camera.position.z = 5

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(canvas.width, canvas.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  document.body.append(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.125
  controls.update()




  // utility setup
  const textureLoader = new THREE.TextureLoader()

  const effectComposer = new EffectComposer(renderer)
  effectComposer.setSize(canvas.width, canvas.height)
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  const MyPass = {
    uniforms: {
      tDiffuse: { value: null },
    },
    vertexShader: `
    void main()
    {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse;

    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `,
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
    size: 0.005,
    sizeAttenuation: true
  })
  const particles = new THREE.Points(particleGeo, particleMat)

  // scene.add(particles)

  const shaderGeo = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
  const shaderMat = new THREE.PointsMaterial({
    color: new THREE.Color('white'),
    size: 0.2,
    sizeAttenuation: true
  })
  const shader = new THREE.Points(shaderGeo, shaderMat)



  const geo = new THREE.BoxBufferGeometry(1, 1, 1, 16, 16, 16)
  const mat = new THREE.MeshNormalMaterial({ wireframe: true })
  for (let i = 0; i < 100; i++) {
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.x = (Math.random() - 0.5) * 20
    mesh.position.y = (Math.random() - 0.5) * 20
    mesh.position.z = (Math.random() - 0.5) * 20
    mesh.rotation.x = (Math.random() - 0.5)
    mesh.rotation.z = (Math.random() - 0.5)

    scene.add(mesh)
  }


  // loading page
  const loadingManager = new THREE.LoadingManager(
    // loaded
    () => {
      console.log('hello')
      gsap.to(loadingMat.uniforms.uAlpha, { duration: 3, value: 0 })
    },
    // progress
    () => {
      console.log('loading in progress')
    }
  )

  const loadingGeo = new THREE.PlaneBufferGeometry(2, 2)
  const loadingMat = new THREE.ShaderMaterial({
    uniforms: {
      uAlpha: { value: 1 }
    },
    vertexShader: `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
    `,
    fragmentShader: `
    uniform float uAlpha;

    void main() {
      gl_FragColor = vec4(1.0, 1.0, 0.0, uAlpha);
    }
    `,
    transparent: true
  })
  const loading = new THREE.Mesh(loadingGeo, loadingMat)
  loading.rotation.x = -Math.PI / 2
  scene.add(loading)




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

    // particles.rotation.x = Math.random() * 0.02

    controls.update()

    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    effectComposer.render()
  }
  animate()
}