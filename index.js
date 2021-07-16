import express from 'express'

const app = express()


app.get('/', (_, res) => {
    res.send('<h1>TESTING EXPRESS APP WITH WebPack !!</h1>')
})

app.listen(8000, () => {
    console.log(`Server running on \x1b[33mhttp://localhost:8000\x1b[0m`);
    console.log(new Date());
})