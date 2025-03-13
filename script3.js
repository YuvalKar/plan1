// הגדרת משתנים
let scene, camera, renderer, player, cubes = [];
let playerSpeed = 0.1;
let cubeSpeed = 0.05;
let score = 0;
let hitCount = 0;
let boundery = 3;

// אתחול סצנה, מצלמה ורנדר
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 4); // שינוי מיקום המצלמה
    camera.lookAt(0, 0, -10); // כיוון המצלמה למרכז הסצנה

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

	// יצירת DirectionalLight
	const directionalLight = new THREE.DirectionalLight(0xf0f0ff, 1); // צבע לבן, עוצמה 1
	// מיקום האור
	directionalLight.position.set(15, 5, 5); // מיקום האור ב-x, y, z
	// הוספת האור לסצנה
	scene.add(directionalLight);
	
	// יצירת HemisphereLight
	const hemisphereLight = new THREE.HemisphereLight(0xffffcc, 0x080820, 1);
	// הוספת האור לסצנה
	scene.add(hemisphereLight);

    // יצירת שחקן
    //const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    //const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    //player = new THREE.Mesh(playerGeometry, playerMaterial);
	    
	// יצירת מטוס שחקן
    player = createAirplane();
	
    scene.add(player);

    // טיפול באירועי מקלדת
    document.addEventListener('keydown', onKeyDown, false);

    // יצירת קוביות
    setInterval(createCube, 1000);

    animate();
}

// פונקציה ליצירת מטוס
function createAirplane() {
    const airplane = new THREE.Group();

    // גוף המטוס
    const bodyGeometry = new THREE.BoxGeometry(0.2, 0.2, 1);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xdd0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    airplane.add(body);

    // כנפיים
    const wingGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.2);
    const wingMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const wing1 = new THREE.Mesh(wingGeometry, wingMaterial);
    wing1.position.y = 0.15;
    airplane.add(wing1);

    const wing2 = new THREE.Mesh(wingGeometry, wingMaterial);
    wing2.position.y = -0.15;
    airplane.add(wing2);

    // זנב
    const tailGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.1);
    const tailMaterial = new THREE.MeshPhongMaterial({ color: 0x88ff00 });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.z = 0.35;
	tail.position.y = 0.1;

    airplane.add(tail);

    return airplane;
}

// פונקציית אנימציה
function animate() {
    requestAnimationFrame(animate);

    // תנועת קוביות
    cubes.forEach(cube => {
        cube.position.z += cubeSpeed;
        if (cube.position.z > 5) {
            // קוביה עברה את השחקן מאחור
            scene.remove(cube);
            cubes.splice(cubes.indexOf(cube), 1);
            score++;
            console.log("Score: " + score);
        } else if (checkCollision(player, cube)) {
            // התנגשות עם שחקן
            playSound();
            scene.remove(cube);
            cubes.splice(cubes.indexOf(cube), 1);
        }
    });
	
    // עדכון מידע על המסך
    updateInfo();
	
    renderer.render(scene, camera);
}

// פונקציה ליצירת קוביה
function createCube() {
	
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const color = Math.random() * 0xffffff; // צבע אקראי
    const material = new THREE.MeshPhongMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = Math.random() * boundery*2 - boundery;
    cube.position.z = -25;
    scene.add(cube);
    cubes.push(cube);
}

// פונקציה לבדיקת התנגשות
function checkCollision(object1, object2) {
    const box1 = new THREE.Box3().setFromObject(object1);
    const box2 = new THREE.Box3().setFromObject(object2);
    return box1.intersectsBox(box2);
}

// פונקציה להשמעת צליל
function playSound() {
    const audio = new Audio('beep.wav');
    audio.play();
	hitCount++; // הגדלת מונה פגיעות
}

// פונקציה לטיפול באירועי מקלדת
function onKeyDown(event) {
    switch (event.keyCode) {
        case 37: // חץ שמאלה
            player.position.x -= playerSpeed;
			if (player.position.x < -boundery){ player.position.x = -boundery};
            break;
        case 39: // חץ ימינה
            player.position.x += playerSpeed;
			if (player.position.x > boundery){ player.position.x = boundery};
            break;
    }
}

// פונקציה לעדכון מידע על המסך
function updateInfo() {
    const infoDiv = document.getElementById('info');
    infoDiv.innerHTML = `קוביות פעילות: ${cubes.length}<br>פגיעות: ${hitCount}`;
}

init();