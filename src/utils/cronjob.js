const cron = require('node-cron');
const ConnectionRequestModel = require('../models/connectionRequest');
const {subDays, startOfDay, endOfDay} = require('date-fns');

cron.schedule("0 8 * * *",async () => {
    // console.log("Hello world, " + new Date())
    // send email to all people who have got request last day of yesterday.
    const yesterday = subDays(new Date(),1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    try {
        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd,
            }
        }).populate("fromUserId toUserId");

        const listofEmails = [...new Set(pendingRequests.map(request => request.toUserId.email))];

        for(const email of listofEmails){
            // send email to user.
        }

    } catch(err){
        console.log(err);
    }
});