const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');
app.use(methodOverride("_method"));


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); 
app.use(express.urlencoded({extended:true})); 



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then((res)=>{
    console.log(`connected to db`);
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}






// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"myHome",
//         descreption:"by the beach",
//         price:1200,
//         location:"mumbai, maharastra",
//         country:"india"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })

/// its  index rout
app.get("/listings", async(req,res)=>{
    let allListings = await Listing.find({});
    // console.log(lists);
    res.render("./listings/index.ejs",{allListings});
});


// create new listing
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});
// this is also the part of create new listing
app.post("/listings", async(req,res)=>{
    // let {title,descreption,image,price,location,country}=req.body;
    //coz we have made something new in new.ejs
    let listing = req.body.listing;
    //console.log(listing);
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
});


// this is show rout
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
});



// edit listing rout

app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
});
// update
app.put("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    // let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id,{...req.body.listing},{new:true});
    res.redirect("/listings");
});




// DELETE THE LISTING
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
})





app.listen(port,()=>{
    console.log(`app is listening at port ${port}`);
})
