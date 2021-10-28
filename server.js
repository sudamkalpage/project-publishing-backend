const app = require('./app')

let port = 9000;

//start server in port 9000
app.listen(port, () => {
    console.log(`Server started on Port ${port}`);
});