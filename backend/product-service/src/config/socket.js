import {Server} from "socket.io"
import http from "http"
import express from "express"
import { PRODUCT } from "../model/productModel.js";
import { BID } from "../model/bidModel.js";

const app = express();

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:"*",
        methods:['Get', "Post"]
    }
});

const userSocketMap = {};
const auctionTimers = {};

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if(userId && userId !== "undefined"){
        userSocketMap[userId] = socket.id
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    }

    socket.on("joinChat", (productId) =>{
        socket.join(productId);
        console.log(`user ${userId} joined chat room ${productId}`)
    })

    socket.on("disconnect", (productId) => {
        socket.leave(productId)
        console.log("User disconnected");

        delete userSocketMap[userId]
    })
})

export const startAuctionTimer = (productId, seconds) => {
    if(auctionTimers[productId]){
        clearInterval(auctionTimers[productId].interval)
    }

    const endTimer = Date.now() + seconds * 1000
    auctionTimers[productId] = {}

    auctionTimers[productId].interval = setInterval(async() => {
        try {
            const remaining = endTimer - Date.now()
            io.to(productId).emit("countdown", { remaining })

            if(remaining <= 0){
                clearInterval(auctionTimers[productId].interval)
                delete auctionTimers[productId]

                const product = await PRODUCT.findById(productId)

                if(!product){
                    return
                }

                const highestBid = await BID.findOne({ product: productId })
                    .sort({ amount: -1 })
                    .populate("bidder", "name email")

                product.status = "ended"

                if(highestBid){
                    product.currentBid = highestBid.amount
                    product.AuctionWinner = highestBid.bidder._id
                }

                await product.save()

                io.to(productId).emit("auctionEnded", {
                    productId,
                    winner: highestBid?.bidder || null,
                    amount: highestBid?.amount || 0
                })

                console.log(`Auction ended for ${productId}`)
            }
        } catch (error) {
            console.log("Auction Timer Error", error.message)
        }
    }, 1000)
}

export {app, io, server}

