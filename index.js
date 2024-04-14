const express = require('express')
const notion = require('./services/notion')
const path = require('path')
const PORT = process.env.PORT || 8000

const app = express()
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
})

app.get('/api/weekly-todos', async (req, res) => {
  const todos = await notion.getTodos()
  res.json(todos)
})

app.get('/api/title', async (req, res) => {
  const title = await notion.getTitle()
  res.json(title)
})
app.listen(PORT, console.log(`Server started on port ${PORT}`))

module.exports = app
