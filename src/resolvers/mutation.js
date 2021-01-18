import { v1 as uuidv1 } from "uuid"
import stripePackage from "stripe"
import * as dynamoDBLib from "../../libs/dynamodb-lib"

export const makeABooking = async (args, context) => {
    const getPrices = async () => {
        const params = {
            TableName: process.env.ListingsDB || "dev-listings",
            KeyConditionExpression: "listingId = :listingId",
            ExpressionAttributeVaules: {
                ":listingId": args.listingId
            }
        }
        try {
            const listings = await dynamoDBLib.call("query", params)
            return listings
        } catch (e) {
            return e
        }
    }

    const listingObject = await getPrices()

    const bookingCharge = parseInt(listingObject.Item[0].price) * args.size

    const listingName = listingObject.listingName

    const stripe = stripePackage(process.env.stripSecretKey)

    const stripeResult = await stripe.charges.create({
        source: "tok_visa",
        amount: bookingCharge,
        description: `Charge for booking of listing ${args.listingId}`,
        currency: "usd",
    })

    const params = {
        TableName: process.env.BookingsDB,
        Item: {
            bookingId: uuidv1(),
            listingId: args.listingId,
            bookingDate: args.bookingDate,
            size: args.size,
            bookingTotal: bookingCharge,
            customerEmail: args.customerEmail,
            customers: args.customers,
            createdTimestamp: Date.now(),
            chargeReciept: stripeResult.receipt_url,
            paymentDetails: stripeResult.payment_method_details,
        }
    }
    try{
        await dynamoDBLib.call("put", params)
        return {
            bookingId: params.Item.bookingId,
            listingId: params.Item.listingId,
            bookingDate: params.Item.bookingDate,
            size: params.Item.size,
            bookingTotal: params.Item.bookingTotal,
            customerEmail: params.Item.customerEmail,
            customers: params.Item.customers.map(c => ({
                name: c.name,
                Surname: c.Surname,
                country: c.country,
                passportNumber: c.passportNumber,
                physioScore: c.physioScore,
            })),
            chargeReciept: params.Item.chargeReciept,
        }
    } catch (e) {
        return e
    }
}


