import express from 'express';

const app = express();
app.use(express.json())


let counter = 1
let db = new Map()

const isTitleValid = (title) => title && typeof title == 'string'
const isCompletedValid = (completed) => completed && typeof completed == 'boolean'


app.get('/', (req, res) => {
  return res.json('Hello World!')
});

app.get('/tasks', (req, res) => {
  const result = Array.from(db.values())
  return res.json(result)
});

app.post('/tasks', (req, res) => {
  const { title, completed } = req.body
  if (!isTitleValid(title)) return res.send('Title is invalid!')
  if (!isCompletedValid(completed)) return res.send('Completed is invalid!')

  const newId = counter++
  const element = {
    title,
    completed,
    id: newId
  }
  db.set(newId, element)

  return res.send(element)
});

app.put('/tasks/:id', (req, res) => {

  const { title, completed } = req.body
  if (!isTitleValid(title)) return res.send('Title is invalid!')
  if (!isCompletedValid(completed)) return res.send('Completed is invalid!')

  const { id } = req.params

  const task = db.get(+id)
  if (!task) {
    return res.send('Task not found')
  }
  task.title = title
  task.completed = completed


  return res.send(task)
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params
  db.delete(+id)

  const result = Array.from(db.values())
  return res.json(result)
});

const port = parseInt(process.env.PORT || '3000');

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});