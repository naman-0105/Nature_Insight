document.getElementById('plantForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Clear previous plant information
    const plantInfoDiv = document.getElementById('plantInfo');
    plantInfoDiv.innerHTML = '';

    // Show loading spinner
    const loadingSpinner = document.getElementById('loading');
    loadingSpinner.style.display = 'block';

    const formData = new FormData();
    formData.append('image', document.getElementById('plantImageInput').files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log('Received data:', data); // Log the received data
        displayPlantInfo(data);
    } catch (error) {
        console.error('Error:', error);
        plantInfoDiv.textContent = 'Error fetching plant information.';
    } finally {
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
    }
});

function displayPlantInfo(data) {
    const plantInfoDiv = document.getElementById('plantInfo');
    plantInfoDiv.innerHTML = '';

    if (data && data.plantInfo) {
        const lines = data.plantInfo.split('\n');
        lines.forEach(line => {
            const parts = line.split(':');
            if (parts.length === 2) {
                const heading = document.createElement('strong');
                heading.textContent = parts[0] + ':';
                const content = document.createElement('span');
                content.textContent = ' ' + parts[1].trim(); // Trim to remove extra spaces
                const p = document.createElement('p');
                p.style.marginBottom = '20px'; // Increase separation between sections
                p.appendChild(heading);
                p.appendChild(content);
                plantInfoDiv.appendChild(p);
            } else {
                const p = document.createElement('p');
                p.textContent = line.trim(); // Trim to remove extra spaces
                p.style.marginBottom = '20px'; // Increase separation between sections
                plantInfoDiv.appendChild(p);
            }
        });
    } else {
        plantInfoDiv.textContent = 'No plant information found.';
    }
}

document.getElementById('plantImageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const imgElement = document.createElement('img');
        imgElement.src = event.target.result;
        imgElement.className = 'img-thumbnail';
        document.getElementById('plantImagePreview').innerHTML = '';
        document.getElementById('plantImagePreview').appendChild(imgElement);
    };

    reader.readAsDataURL(file);
});
