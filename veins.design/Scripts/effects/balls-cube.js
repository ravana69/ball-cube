var container, stats;
var camera, scene, renderer;
var geometry, material, mesh;

function init() {
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        return false;
    }
    renderer = new THREE.WebGLRenderer();
    if (renderer.extensions.get('ANGLE_instanced_arrays') === false) {
        document.getElementById('notSupported').style.display = '';
        return false;
    }
    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1400;
    scene = new THREE.Scene();
    var circleGeometry = new THREE.CircleBufferGeometry(1, 6);
    geometry = new THREE.InstancedBufferGeometry();
    geometry.index = circleGeometry.index;
    geometry.attributes = circleGeometry.attributes;
    var particleCount = 75000;
    var translateArray = new Float32Array(particleCount * 3);
    for (var i = 0, i3 = 0, l = particleCount; i < l; i++ , i3 += 3) {
        translateArray[i3 + 0] = Math.random() * 2 - 1;
        translateArray[i3 + 1] = Math.random() * 2 - 1;
        translateArray[i3 + 2] = Math.random() * 2 - 1;
    }
    geometry.addAttribute('translate', new THREE.InstancedBufferAttribute(translateArray, 3, 1));
    material = new THREE.RawShaderMaterial({
        uniforms: {
            map: { value: new THREE.TextureLoader().load('../../Content/textures/sprites/circle.png') },
            time: { value: 0.0 }
        },
        vertexShader: document.getElementById('vshader').textContent,
        fragmentShader: document.getElementById('fshader').textContent,
        depthTest: true,
        depthWrite: true
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(500, 500, 500);
    scene.add(mesh);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    //stats = new Stats();
    //container.appendChild(stats.dom);

    window.addEventListener('resize', onWindowResize, false);
    return true;
}

function onWindowResize(event) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    //stats.update();
}

function render() {
    var time = performance.now() * 0.0005;
    material.uniforms.time.value = time;
    mesh.rotation.x = time * 0.2;
    mesh.rotation.y = time * 0.4;
    renderer.render(scene, camera);
}

if (init()) {
    animate();
}