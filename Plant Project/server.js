const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Set up multer for handling multipart/form-data
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const formData = new FormData();
        formData.append('images', fs.createReadStream(req.file.path));

        const project = 'all';

        const response = await axios.post(
            `https://my-api.plantnet.org/v2/identify/${project}?api-key=${process.env.PLANTNET_API_KEY}`,
            formData,
            { headers: formData.getHeaders() }
        );

        console.log('PlantNet API response:', response.data);

        if (!response.data.results || response.data.results.length === 0) {
            return res.status(404).json({ error: 'No plant information found.' });
        }

        const bestMatch = response.data.bestMatch;

        exec(`python app.py "${bestMatch}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({ error: 'Error executing Python script.' });
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);

            // Assuming stdout contains the formatted response from app.py
            const plantInfo = stdout.trim(); // Trim to remove any extra whitespace

            // Send both PlantNet data and additional info to the frontend
            res.json({
                plantnetData: response.data,
                plantInfo: plantInfo  // Send plant info to frontend
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
