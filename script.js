let uploadInput = document.querySelector('#upload-file');
let dropArea = document.querySelector('label.upload');
let helpText = document.querySelector('.text');
let elements = document.querySelector('.navbar');
let uploadState = document.querySelector('.row.upload');
let downloadState = document.querySelector('.row.download');
let navs = document.querySelectorAll('.nav-item');
let canvasContainer = document.querySelector('.image-container');
let canvas = document.querySelector('.image');
let ctx = canvas.getContext('2d');
let deg = 0,
    blurValue = 0,
    brightnessValue = 1,
    hueRotateValue = 1,
    invertValue = 1,
    contrastValue = 1,
    grayscaleValue = 1,
    sepiaValue = 1,
    saturateValue = 1,
    opacityValue = 1,
    image;

uploadInput.addEventListener('input', async function(e) {
    let file = this.files[0];
    showImage(file);
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
    let file = e.dataTransfer.files[0];

    showImage(file);
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

function showImage(file) {
    let reader = new FileReader();
    uploadState.classList.add('d-none');
    elements.classList.remove('d-none');
    downloadState.classList.remove('d-none');
    reader.onload = function() {

        image = document.createElement('img');
        image.src = reader.result;
        image.width = canvas.width;
        image.height = canvas.height;
        localStorage.setItem('image', JSON.stringify(reader.result));
        image.onload = function() {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        }
    }
    if (file) {
        reader.readAsDataURL(file)
    }

}


function rotate(rotateType) {
    deg === 360 || deg === -360 ? deg = 0 : true;
    rotateType === 'right' ? deg += 90 : true;
    rotateType === 'left' ? deg -= 90 : true;
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
    image.src = JSON.parse(localStorage.getItem('image'));
    let ctx = canvasRotate.getContext('2d');
    canvasContainer.appendChild(canvasRotate);
    deg === 90 || deg === -270 ? ctx.translate(canvasRotate.width, 0) : true;
    deg === 180 || deg === -180 ? ctx.translate(canvasRotate.width, canvasRotate.height) : true;
    deg === 270 || deg === -90 ? ctx.translate(0, canvasRotate.height) : true;
    deg === 360 || deg === -360 ? ctx.translate(0, 0) : true;
    ctx.rotate(deg * Math.PI / 180);
    ctx.globalAlpha = opacityValue;
    ctx.filter = `blur(${blurValue}px) brightness(${brightnessValue}) hue-rotate(${hueRotateValue}deg) invert(${invertValue}%) contrast(${contrastValue}) grayscale(${grayscaleValue}%) sepia(${sepiaValue}%) saturate(${saturateValue})`;
    ctx.drawImage(image, 0, 0, canvasRotate.width, canvasRotate.height);
}