const carousel = document.querySelector('.carousel');
const images = document.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
let currentIndex = 0;

function showImage(index) {
    currentIndex = (index + images.length) % images.length;
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}

document.getElementById('identifyButton').addEventListener('click', function() {
    window.location.href = 'http://localhost:3000'; // URL where website2 is running
});


function showNextImage() {
    showImage(currentIndex + 1);
}

function showPreviousImage() {
    showImage(currentIndex - 1);
}

setInterval(showNextImage, 3000);
nextButton.addEventListener('click', showNextImage);
prevButton.addEventListener('click', showPreviousImage);

