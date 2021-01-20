
const AWS = require("aws-sdk")
AWS.config.update({ region: "us-east-1" })
const docClient = new AWS.DynamoDB.DocumentClient()

const listings = require("./listings.json")
console.log("Listings.Init", listings)

listings.map(l => {
    listingParams = {
        TableName: "dev-listings",
        Item: {
            coverPhoto: l.coverPhoto,
            guide: {
                avatar: l.guide.avatar,
                bio: l.guide.bio,
                name: l.guide.name,
            },
            listingActivities: l.listingActivities,
            listingDescritption: l.listingDescription,
            listingId: l.listingId,
            listingName: l.listingName,
            listingLocation: l.listingLocation,
            listingType: l.listingType,
            numberOfDays: l.numberOfDays,
            price: l.price,
            specialAmount: l.specialAmount,
            specialType: l.specialType,
        },
    }
    docClient.put(listingParams, function(err, data) {
        if(err) {
            console.error(
                "Unable to add listing",
                ". Error JSON: ",
                JSON.stringify(err, null, 2)
            )
        } else {
            console.log("PutItem succeeded: ")
        }
    })
})