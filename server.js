const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/auth')
const dataModelSchema = require('./models/dataModel')
const verifyToken = require('./verifyToken')
const app = express();
const port = 3004;

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter)



mongoose.connect(env.mongodb.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  () => console.log("db connetcted")
  ).catch(err => console.log(err));


app.get('/', verifyToken, async (req, res) => {
  if(req && req.decodedToken){
    try {
      const notes = await dataModelSchema.find({ user: req.decodedToken._id });
      res.json(notes);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
  }
    
});


app.post('/add', verifyToken, async (req, res) => {
    if(req && req.decodedToken){
      try {
        const note = {
          title : req.body.title,
          description : req.body.description,
          imageUrl: req.body.imageUrl,
          url: req.body.url,
          user: req.decodedToken._id
        }

        const Note = await dataModelSchema.create(note)
        res.status(201).json(Note);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    }
});

app.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { description, imageUrl } = req.body;
  const updatedNote = await dataModelSchema.findByIdAndUpdate(id, { description, imageUrl }, { new: true });
  res.json(updatedNote);
});

app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await dataModelSchema.findByIdAndDelete(id);
  res.json({ message: 'Note deleted' });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
