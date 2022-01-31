const mongoose=require("mongoose");
const Campground=require("../models/campground");
const cities=require("./cites");
const {places,descriptors}=require("./seedHelpers");

mongoose.connect('mongodb://localhost:27017/yelpCamp')
.then(()=>{
console.log("Data base is connected !!");
});

const sample=(array)=>array[Math.floor(Math.random()*array.length)];

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
          //Your user id
            author:"61e7c9071209d9dec9a768c3",
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam eveniet, voluptatem modi, maiores debitis possimus aliquam totam molestias quia delectus excepturi consequuntur consequatur. Vel nisi voluptate, vitae voluptates deserunt exercitationem?",
            price,
            geometry:{
              "type":"Point",
              "coordinates":[cities[random1000].longitude,
              cities[random1000].latitude]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dygo6du89/image/upload/v1642675432/YelpCamp/k8d61uo9wjsnm56m5xjz.jpg',
                  filename: 'YelpCamp/txeyfcxffhq1onuwpvbh',
                  
                },
                {
                  url: 'https://res.cloudinary.com/dygo6du89/image/upload/v1642675442/YelpCamp/on6vzmgfafix94gvtgz3.jpg',
                  filename: 'YelpCamp/s3bceefym9i5xwcylmkx',
                  
                }
              ]
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})
