const express = require('express')
const axios = require('axios')
const app = express();



app.get("/trains", async (req, res) => {
    try {
        const accessCode = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTIxOTQzNTIsImNvbXBhbnlOYW1lIjoiVHJhaW4gQ2VudHJhbCIsImNsaWVudElEIjoiOTlmODcwNjQtOTg2NS00NjhhLTk2ODctZTkxZWZkYjM1MTYxIiwib3duZXJOYW1lIjoiIiwib3duZXJFbWFpbCI6IiIsInJvbGxObyI6IlMyMDIwMDAyMDMxMyJ9.X_j-Hhue2CDeBJlrtHArH7yVXyF0iGmezDXRucEskk4';
        const headers = { Authorization: `Bearer ${accessCode}` };
        const result = await axios.get("http://20.244.56.144/train/trains", { headers })
        let data = Object.values(result.data)
        // console.log(data);

        // Ignoring trains in next 30 minutes

        const currTime = new Date()
        const currHour = currTime.getHours()
        const currMinutes = currTime.getMinutes()
        for(let i=0;i<data.length;i++){
            const trainHour = data[i].departureTime.Hours
            const trainMinutes = data[i].departureTime.Minutes
            const delay = data[i].delayedBy
            // console.log(trainHour,trainMinutes);
            const gap = (60*trainHour+trainMinutes+delay - 60*currHour-currMinutes);
            if(gap<=30){
                data.splice(i,1);
                i--;
            }
        }
        


        // Sorting Trains

        data.sort((train1,train2)=>{
            // increasing order of prices
            if(train1.price.AC !== train2.price.AC){
                return train1.price.AC - train2.price.AC
            }
            else if(train1.price.sleeper !== train2.price.sleeper){
                return train1.price.sleeper - train2.price.sleeper
            }
            
            // decreasing order of tickets
            if(train1.seatsAvailable.AC !== train2.seatsAvailable.AC){
                return train2.seatsAvailable.AC - train1.seatsAvailable.AC
            }
            
            //decreasing order of departure time considering delay
            const departtime1 = 60*train1.departureTime.Hours+train1.departureTime.Minutes+train1.delayedBy
            const departtime2 = 60*train2.departureTime.Hours+train2.departureTime.Minutes+train2.delayedBy
            
            return departtime2 - departtime1
        })



        res.json(data)
    } catch (err) {
        console.log(err);
    }

})

app.listen(5050, () => {
    console.log("server up on port 5050");
})