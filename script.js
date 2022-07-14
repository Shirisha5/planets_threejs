/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */

// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Lights

const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)


// Mesh

// const material = new THREE.MeshToonMaterial({ color: '#ffeded' })
var texture1 = new THREE.TextureLoader().load('./public/images/earth_daymap.jpg');
const Ematerial = new THREE.MeshBasicMaterial({ map: texture1, overdraw: 0.1 });
var texture2 = new THREE.TextureLoader().load('./public/images/mars.jpg');
const Mmaterial = new THREE.MeshBasicMaterial({ map: texture2, overdraw: 0.1 });
var texture3 = new THREE.TextureLoader().load('./public/images/jupiter.jpg');
const Jmaterial = new THREE.MeshBasicMaterial({ map: texture3, overdraw: 0.1 });

const mesh1 = new THREE.Mesh(
    new THREE.SphereGeometry(1.1, 100, 100),
    Ematerial
)
const mesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 100, 100),
    Mmaterial
)
const mesh3 = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 100, 100),
    Jmaterial
)

scene.add(mesh1, mesh2, mesh3)


mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2
//

const objectsDistance = 4


mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2



const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Animate
 */
const clock = new THREE.Clock()

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)
    if (newSection != currentSection) {
        // ...

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3'
            }
        )
    }
    console.log(scrollY)
})


/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5

    console.log(cursor)
})

//particles

const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
    color: '#ffeded',
    sizeAttenuation: true,
    size: 0.03
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


let previousTime = 0
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Animate camera
    camera.position.y = -scrollY / sizes.height * objectsDistance

    //

    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()