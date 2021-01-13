import {getAllListings, getAListing} from "./query";

export const resolvers = {
    Query: {
        getAllListings: (root, args, context) => getAllListings(args, context),
        getAListings: (root, args, context) => getAListings(args, context)
    }
}
