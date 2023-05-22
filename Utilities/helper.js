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

exports.updateRating = async(productName) => {
    try {
        const productInfo = await mKartModel.products.findOne({productName : productName},{_id:0});

        if(productInfo) {
            
            let finalRating = 0;
            let avgRating = productInfo.avgRating;
            
            let totalRating = 0;
            let n = avgRating.length;

            for(const rating of avgRating) { // total of all the ratings
                totalRating+=rating.rating;
                
                //console.log(rating.rating);
            }
            
            finalRating = totalRating / n; // the average of all rating
            console.log(finalRating.toFixed(1));
            finalRating = finalRating.toFixed(1);
            await mKartModel.products.updateOne({ // now the rating will be updated for the product
                productName : productName
            },
            {
                $set : {rating : finalRating}
            })

        } else {
            return 0;
        }

    } catch (error) {
        return 0;
    }
}