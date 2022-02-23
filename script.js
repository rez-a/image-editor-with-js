let uploadInput = document.querySelector('#upload-file');
let dropArea = document.querySelector('label.upload');
let helpText = document.querySelector('.text');
let elements = document.querySelector('.navbar');
let uploadState = document.querySelector('.row.upload');
let downloadState = document.querySelector('.row.download');
let navs = document.querySelectorAll('.nav-item');
let deg = 0,
    vertical = 0,
    horizontal = 0,
    blurValue = 0,
    brightnessValue = 1,
    hueRotateValue = 1,
    invertValue = 1,
    contrastValue = 1,
    grayscaleValue = 1,
    sepiaValue = 1,
    saturateValue = 1,
    opacityValue;

uploadInput.addEventListener('input', async function(e) {
    let file = this.files[0];
    showImage(file);
})
document.querySelectorAll("input[type='range']").forEach(input => {
    input.addEventListener('input', function() {
        let value = (this.value - this.min) / (this.max - this.min) * 100
        this.style.background = 'linear-gradient(to right, #212529 0%, #212529 ' + value + '%, #fff ' + value + '%, white 100%)'
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

function showImage(file) {
    let reader = new FileReader();
    let image = document.querySelector('.image');
    uploadState.classList.add('d-none');
    elements.classList.remove('d-none');
    downloadState.classList.remove('d-none');

    reader.onload = function() {
        image.src = reader.result;
        localStorage.setItem('image', JSON.stringify(reader.result))
    }
    if (file) {
        reader.readAsDataURL(file)
    }
}

function rotate(rotateType) {
    let image = document.querySelector('.image');
    switch (rotateType) {
        case 'right':
            deg += 90;
            image.style.transform = `rotate(${deg}deg)`;
            break;
        case 'left':
            deg -= 90;
            image.style.transform = `rotate(${deg}deg)`;
            break;
        case 'vertical':
            vertical += 180;
            image.style.transform = `rotateZ(${vertical}deg)`;
            break;
        case 'horizontal':
            horizontal += 180;
            image.style.transform = `rotateY(${horizontal}deg)`;
            break;
        default:
            break;
    }

}

function filter(filterType, event) {
    let value = event.target.value;
    let image = document.querySelector('.image');
    switch (filterType) {
        case 'blur':
            blurValue = value;
            console.log(value)
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
            image.style.opacity = value;
            break;
        default:
            break;
    }
    image.style.filter = `blur(${blurValue}px) brightness(${brightnessValue}) hue-rotate(${hueRotateValue}deg) invert(${invertValue}%) contrast(${contrastValue}) grayscale(${grayscaleValue}%) sepia(${sepiaValue}%) saturate(${saturateValue})`;
}