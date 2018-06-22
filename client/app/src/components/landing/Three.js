import React, { Component } from 'react';
import * as THREE from 'three';
import model from './worldpic.json';
import airplane from './avion.json';

let rend = {}
const div = { x: 600, y: 400 }

let rot = 0

class Three extends Component {
  constructor(props) {
    super(props)

    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
  }

  componentDidMount() {
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight

    div.x = width
    div.y = height

    window.addEventListener("resize", this._updateDimensions);

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      width / height,
      0.1,
      1000
    )
    const clock = new THREE.Clock();
    camera.position.z = 5
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setClearColor(0xff00ff, 0)
    renderer.setSize(width, height)
    rend = renderer

    let loader = new THREE.JSONLoader();
    const material = new THREE.MeshBasicMaterial({ color: 0x4444ff })
    const mat_air = new THREE.MeshStandardMaterial(
      { color: 0xffffff, roughness: 0.5, metalness: 0.8 })

    const loading = loader.parse(model)
    const loading2 = loader.parse(airplane)

    let logo = new THREE.Mesh(loading.geometry, material);
    let flight = new THREE.Mesh(loading2.geometry, mat_air);


    let ambientLight = new THREE.AmbientLight(0xcccccc);
    let pointBlue = new THREE.PointLight(0x003399, 5, 10);
    pointBlue.position.set(0, 5, 0);

    scene.add(logo)
    scene.add(flight)
    scene.add(ambientLight);
    scene.add(pointBlue);

    this.scene = scene
    this.camera = camera
    this.renderer = renderer
    this.material = material
    this.logo = logo
    this.flight = flight
    this.clock = clock
    this.screen_x = 0
    this.screen_y = 0

    this.mount.appendChild(this.renderer.domElement)
    this.start()
  }
  
  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
  }

  _onMouseMove(e) {
    let rect = e.target.getBoundingClientRect()

    let x = e.clientX - rect.left
    let y = e.clientY - rect.top

    this.screen_x = x - (div.x * 0.5)
    this.screen_y = y - (div.y * 0.5)
  }

  _onWheel(e) {
    rot += e.deltaY * 0.000001
    if (rot > 0.01) rot = 0.01; else if (rot < 0) rot = 0;
    rot = parseFloat(rot.toFixed(7))
  }

  _updateDimensions() {
    let wWidth = window.innerWidth
    rend.setSize(wWidth, wWidth * 0.5)
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  animate() {
    this.logo.rotation.y += ((this.screen_x * 0.001) - this.camera.position.x) * 0.01
    this.camera.position.y += ((this.screen_y * 0.01) - this.camera.position.y) * 0.01
    this.camera.lookAt(this.scene.position);

    this.flight.rotateOnAxis(new THREE.Vector3(0, 1, 1), -rot)
    this.logo.material.color.setHSL(Math.sin(this.clock.getElapsedTime() * 0.05), 0.5, 0.5);

    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div className="three-d"
        onMouseMove={this._onMouseMove.bind(this)}
        onWheel={this._onWheel.bind(this)}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}

export default Three