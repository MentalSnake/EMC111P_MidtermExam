let SCENE = new THREE.Scene();
let CLOCK = new THREE.Clock();
let FOV = 75;
let NEAR = 0.1;
let FAR = 1000;
let MAXPARTICLES = 900;
let renderer = new THREE.WebGLRenderer();
let delta = 0;
let time = 0;

let texture = new THREE.TextureLoader().load("Image/Star.png")

let texture2 = new THREE.TextureLoader().load("Image/Saturn.jpg")

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Camera
let camera = new THREE.PerspectiveCamera(
    FOV,
    window.innerWidth / window.innerHeight,
    NEAR,
    FAR
);
camera.position.x = 0
camera.position.y = 10
camera.position.z = 25
camera.lookAt((SCENE.position));

//Sphere
let saturnSys = new THREE.Group();
let saturnSysAxis = new THREE.Vector3( 0, 1, 0);
saturnSys.rotation.z = THREE.Math.degToRad(27);
let saturnGeometry = new THREE.SphereGeometry( 4.5, 32, 32);
let saturnMaterial = new THREE.MeshLambertMaterial({map:texture2});
let saturn = new THREE.Mesh( saturnGeometry, saturnMaterial);
SCENE.add(saturn)

//Ring
let saturnRingGeo = new THREE.Geometry();
let vertices = [];
for (let i = 0; i < MAXPARTICLES; i++) {
    let a = THREE.Math.randFloat(7.5, 15);
    let angle = THREE.Math.randFloat(0, Math.PI * 2);
    let b = new THREE.Vector3(
        Math.cos(angle) * a,
        0,
        Math.sin(angle) * a 
    );
    b.angularVelocity = THREE.Math.randFloat(0.1, Math.PI);
    vertices.push(b); 
}

saturnRingGeo.vertices = vertices;

let saturnRing = new THREE.Points(saturnRingGeo, new THREE.PointsMaterial({
    size: 0.4, map:texture
}));
saturn.add(saturnRing);
SCENE.add(saturn);

camera.position.set(0, 15, 30);
camera.lookAt(SCENE.position);

let ambLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 0.6);
SCENE.add( ambLight );

render();
function render(){
    requestAnimationFrame(render);

    delta = CLOCK.getDelta();
    time +- delta * 0.1;
    saturnRing.geometry.vertices.forEach(v => {
        v.applyAxisAngle(saturnSysAxis, v.angularVelocity * delta);
    });
    saturnRing.geometry.verticesNeedUpdate = true;

    //Saturn
    saturn.rotation.z = 0;
    saturn.rotation.y = 0;

    renderer.render(SCENE, camera);
}