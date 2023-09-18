import express from 'express';

const app = express();
const port = 5000;

app.get('/', (_, res) => {

    res.send(`Hello, Express TypeScript!`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})