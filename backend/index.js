const connectomongo = require("./db");
connectomongo();

const express = require('express')
const app = express()
const port = 3000

app.use(express.json()) //Used for accepting the values from the request or accepting requesting parameters 

app.use("/api/auth" , require('./routes/auth'))
app.use("/api/notes", require('./routes/notes'))



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
