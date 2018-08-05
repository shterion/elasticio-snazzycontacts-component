const express = require('express');
const app = express();
const router = express.Router();

const PORT = process.ENV || 3000;


app.get('/', (req, res) => {
  res.send("Flows");
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
