const express = require('express')
const axios = require('axios')
const app = express();



app.get("/trains", async (req, res) => {
    try {
        const accessCode = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTIxOTM1NzUsImNvbXBhbnlOYW1lIjoiVHJhaW4gQ2VudHJhbCIsImNsaWVudElEIjoiOTlmODcwNjQtOTg2NS00NjhhLTk2ODctZTkxZWZkYjM1MTYxIiwib3duZXJOYW1lIjoiIiwib3duZXJFbWFpbCI6IiIsInJvbGxObyI6IlMyMDIwMDAyMDMxMyJ9.r3GdDi2nmLlo19xQQxPPULge-gkEflJt3hoH3sPENY8';
        const headers = { Authorization: `Bearer ${accessCode}` };
        const result = await axios.get("http://20.244.56.144/train/trains", { headers })
        let data = result.data

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
        


        // 



        res.json(data)
    } catch (err) {
        console.log(err);
    }

})

app.listen(5050, () => {
    console.log("server up on port 5050");
})