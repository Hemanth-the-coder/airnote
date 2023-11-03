const express = require("express")
const router = express.Router()
const fetchdata = require("../middleware/fetchdata")
const Notes = require("../models/Notes")
const { body, validationResult } = require("express-validator");



router.get("/getallnotes" ,fetchdata ,  async (req , res) => {
    let userid = req.user.id;
    let notes = await Notes.find({user:userid});
    res.send(notes)
})

router.post("/addnote" , fetchdata , [
    body("title" , "Please enter a valid title").isLength({min:3}),
    body("description" , "Please enter a valid description").isLength({min:5})

] ,async (req , res) => {

    try{

        const {title , description , tag} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
    
            res.status(401).send({errors : errors});
    
        }
    
        const note = new Notes({
            title , description , tag, user : req.user.id
        })
    
        const saved = await note.save()
    
        res.send({response : "The notes is updated"})
    }
    catch(error) {
        res.send({error_message : error})
    }
})

router.delete("/deletenote/:id" , fetchdata , async (req , res)=> {
    const deletenote =await Notes.findById(req.params.id);
    if(!deletenote){
        res.send("Note doesnt exists")
    } 
    
    if(deletenote.user.toString() !== req.user.id){
        console.log("it came here")
        res.send("not allowed to delete this note")
    }

    const deleted = await Notes.findByIdAndDelete(req.params.id)
    res.send("The notes is successfully deleted");
})


router.put("/updatenote/:id" , fetchdata, async (req , res)=> {
    const {title , description , tag} = req.body;
    const newNote = {};

    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //Find the node to be updated 
    const updatednotes = await Notes.findById(req.params.id);
    console.log(updatednotes)
    if(!updatednotes){
        res.status(404).send({errormessage : "Note Not found"})
    }
    if(updatednotes.user.toString() !== req.user.id){ 
       res.status(401).send("Not allowed to edit this note");
    }

    const note = await Notes.findByIdAndUpdate(req.params.id ,{$set: newNote} , {new : true})
    res.json(note)
})

module.exports = router;