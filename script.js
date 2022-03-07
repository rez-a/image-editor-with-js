let uploadInput = document.querySelector('#upload-file'),
    dropArea = document.querySelector('label.upload'),
    helpText = document.querySelector('.text'),
    elements = document.querySelector('.navbar'),
    uploadState = document.querySelector('.row.upload'),
    downloadState = document.querySelector('.row.download'),
    navs = document.querySelectorAll('.nav-item'),
    canvasContainer = document.querySelector('.image-container'),
    canvas = document.querySelector('.image'),
    changeTheme = document.querySelector('#switch-theme'),
    ctx = canvas.getContext('2d'),
    deg = 0,
    blurValue = 0,
    brightnessValue = 1,
    hueRotateValue = 1,
    invertValue = 1,
    contrastValue = 1,
    grayscaleValue = 1,
    sepiaValue = 1,
    saturateValue = 1,
    opacityValue = 1,
    image, state, file, imageFilter, theme;

function load() {
    if (localStorage.getItem('state') === null) {
        state = 'upload';
        theme = 'light';
        localStorage.setItem('state', JSON.stringify(state));
        localStorage.setItem('theme', JSON.stringify(theme));
    } else {
        state = JSON.parse(localStorage.getItem('state'));
        file = JSON.parse(localStorage.getItem('file'));
        imageFilter = JSON.parse(localStorage.getItem('filter'));
        opacityValue = JSON.parse(localStorage.getItem('opacity'));
        theme = JSON.parse(localStorage.getItem('theme'))
    }
    showState(state, file, imageFilter, opacityValue);
    switchTheme(theme);
}

function showState(state, imageURL, imageFilter, opacityValue) {
    if (state === 'upload') {
        uploadState.classList.remove('d-none');
        elements.classList.add('d-none');
        downloadState.classList.add('d-none');
    } else {
        showImage(imageURL, imageFilter, opacityValue);
    }
}

function changeState(imageURL) {
    state = JSON.parse(localStorage.getItem('state'));
    if (state === 'upload') {
        state = 'download'
    } else {
        state = 'upload';
        localStorage.clear();
        opacityValue = 1;
        localStorage.setItem('opacity', JSON.stringify(opacityValue));
        window.location.reload();
    }

    localStorage.setItem('state', JSON.stringify(state));
    showState(state, imageURL, opacityValue);
}
changeTheme.addEventListener('input', function(event) {
    this.checked ? theme = 'dark' : theme = 'light';
    localStorage.setItem('theme', JSON.stringify(theme));
    switchTheme(theme);
})
uploadInput.addEventListener('input', function(e) {
    file = this.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function() {
            localStorage.setItem('file', JSON.stringify(reader.result));
            changeState(reader.result);
        }
        reader.readAsDataURL(file);
    }
})
document.querySelectorAll("input[type='range']").forEach(input => {
    let value = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.background = 'linear-gradient(to right, #212529 0%, #212529 ' + value + '%, #fff ' + value + '%, white 100%)';
    input.addEventListener('input', function() {
        value = (this.value - this.min) / (this.max - this.min) * 100;
        this.style.background = 'linear-gradient(to right, #212529 0%, #212529 ' + value + '%, #fff ' + value + '%, white 100%)';
    })
})
dropArea.addEventListener('dragover', function(e) {
    e.preventDefault()
    helpText.textContent = 'Release to Upload File';
    dropArea.style.backgroundColor = '#e7e8e9';
})
dropArea.addEventListener('dragleave', function(e) {
    e.preventDefault()
    helpText.textContent = 'drag and drop or browse to choose a file';
    dropArea.style.backgroundColor = '#F8F9FA';
})
dropArea.addEventListener('drop', function(e) {
    e.preventDefault()
    file = e.dataTransfer.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function() {
            localStorage.setItem('file', JSON.stringify(reader.result));
            changeState(reader.result);
        }
        reader.readAsDataURL(file);
    }
})
navs.forEach(nav => {
    nav.addEventListener('click', function(e) {
        e.preventDefault();
        let target = e.currentTarget.dataset.nav;
        document.querySelector('.nav-item a.active').classList.remove('active');
        document.querySelector('.tab-item.active').classList.remove('active');
        document.querySelector(`.nav-item[data-nav = ${target}] a`).classList.add('active');
        document.querySelector(`.tab-item[data-tab = ${target}]`).classList.add('active');
    })
})

function download() {
    let canvas = document.querySelector('canvas');
    let a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = 'image-editor.png';
    a.click();
}

function showImage(imageURL, imageFilter, opacityValue) {
    uploadState.classList.add('d-none');
    elements.classList.remove('d-none');
    downloadState.classList.remove('d-none');
    image = document.createElement('img');
    image.src = imageURL;
    image.width = canvas.width;
    image.height = canvas.height;
    deg = JSON.parse(localStorage.getItem('deg'));
    deg === 90 || deg === -270 ? ctx.translate(canvas.width, 0) : true;
    deg === 180 || deg === -180 ? ctx.translate(canvas.width, canvas.height) : true;
    deg === 270 || deg === -90 ? ctx.translate(0, canvas.height) : true;
    deg === 360 || deg === -360 ? ctx.translate(0, 0) : true;
    ctx.rotate(deg * Math.PI / 180);
    ctx.globalAlpha = opacityValue;
    ctx.filter = imageFilter;
    image.onload = function() {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    }
}


function rotate(rotateType) {
    deg === 360 || deg === -360 ? deg = 0 : true;
    rotateType === 'right' ? deg += 90 : true;
    rotateType === 'left' ? deg -= 90 : true;
    localStorage.setItem('deg', JSON.stringify(deg))
    createNewCanvas();
}

function filter(filterType, event) {
    console.log(deg)
    let value = event.target.value;
    switch (filterType) {
        case 'blur':
            blurValue = value;
            break;
        case 'brightness':
            brightnessValue = value;
            break;
        case 'hue-rotate':
            hueRotateValue = value;
            break;
        case 'invert':
            invertValue = value;
            break;
        case 'contrast':
            contrastValue = value;
            break;
        case 'grayscale':
            grayscaleValue = value;
            break;
        case 'sepia':
            sepiaValue = value;
            break;
        case 'saturate':
            saturateValue = value;
            break;
        case 'opacity':
            opacityValue = value;
            break;
        default:
            break;
    }
    createNewCanvas();
}

function createNewCanvas() {
    document.querySelector('.image').remove();
    let canvasRotate = document.createElement('canvas');
    canvasRotate.classList.add('image');
    canvasRotate.setAttribute('width', '300px');
    canvasRotate.setAttribute('height', '300px');
    image = document.createElement('img');
    image.width = '300px';
    image.height = '300px';
    image.src = JSON.parse(localStorage.getItem('file'));
    let ctx = canvasRotate.getContext('2d');
    canvasContainer.appendChild(canvasRotate);
    deg === 90 || deg === -270 ? ctx.translate(canvasRotate.width, 0) : true;
    deg === 180 || deg === -180 ? ctx.translate(canvasRotate.width, canvasRotate.height) : true;
    deg === 270 || deg === -90 ? ctx.translate(0, canvasRotate.height) : true;
    deg === 360 || deg === -360 ? ctx.translate(0, 0) : true;
    ctx.rotate(deg * Math.PI / 180);
    ctx.globalAlpha = opacityValue;
    imageFilter = `blur(${blurValue}px) brightness(${brightnessValue}) hue-rotate(${hueRotateValue}deg) invert(${invertValue}%) contrast(${contrastValue}) grayscale(${grayscaleValue}%) sepia(${sepiaValue}%) saturate(${saturateValue})`;
    ctx.filter = imageFilter;
    localStorage.setItem('filter', JSON.stringify(imageFilter));
    localStorage.setItem('opacity', JSON.stringify(opacityValue));
    ctx.drawImage(image, 0, 0, canvasRotate.width, canvasRotate.height);
}

function switchTheme(theme) {
    if (theme === 'dark') {
        document.querySelector('body').classList.add('dark');
        changeTheme.checked = true;

    } else {
        document.querySelector('body').classList.remove('dark');
        changeTheme.checked = false;
    }
}