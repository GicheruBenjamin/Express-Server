const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.post('/submit-form', (req, res) => {
  const { name, email } = req.body;
  const formData = { name, email };

  // Read existing data from the JSON file (if it exists)
  fs.readFile('form-data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading form data file');
    }

    let formDataArray = [];
    if (data) {
      formDataArray = JSON.parse(data);
    }

    // Add the new form data to the array
    formDataArray.push(formData);

    // Write the updated data back to the JSON file
    fs.writeFile('form-data.json', JSON.stringify(formDataArray), 'utf8', err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing form data file');
      }

      console.log(`Received form data: Name=${name}, Email=${email}`);
      res.send('Form data received and processed successfully!');
    });
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});