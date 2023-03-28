const mKartModel = require('../Model/Schema');

exports.checkUser = async(username) => {
    try {
        const userInfo = await mKartModel.users.find({username : username});
        if(userInfo.length > 0) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.log(error.message);
    }
}