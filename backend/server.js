const app = require('./app');

app.get("/", (req, res) => {
  res.send("API Working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
