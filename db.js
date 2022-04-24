const mongoose=require('mongoose')
// mongoose.connect("mongodb+srv://yashsinha:harrypotter@yashsinha-gljp2.mongodb.net/BestWishes",{
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
//     useCreateIndex:true
// })
mongoose.connect("mongodb+srv://js903783:apple4648@formfillup.zasik.mongodb.net/BestWishes",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})
.then(()=>{
    console.log("Db connected sucessfully")
})
.catch((err)=>{
console.log("error message",err)
})







