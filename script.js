let uploadInput = document.querySelector('#upload-file');
let dropArea = document.querySelector('label.upload');
let helpText = document.querySelector('.text');
let elements = document.querySelector('.navbar');
let uploadState = document.querySelector('.row.upload');
let downloadState = document.querySelector('.row.download');


uploadInput.addEventListener('input', async function(e) {
    let file = this.files[0];
    // await saveImage(file)
    showImage(file);
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
    // saveImage(file)

    showImage(file);
})

function saveImage(file) {
    let reader = new FileReader();
    reader.onload = function() {

    }
    if (file) {
        reader.readAsDataURL(file)
    }
}

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