import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subcription} from "../models/subcription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params;

    // Total video views
    const totalVideoViews = await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(channelId)
            }
        }
       
    ])

    const totalViews = totalVideoViews.reduce((sum, video) => sum + video.views, 0);

    // Total subscribers
    const totalSubscribers = await Subcription.countDocuments({channel:channelId});

    // Total videos
    const totalVideos = await Video.countDocuments({owner:channelId});

    // Total like
    const totalLike = await Like.countDocuments({likedBy:channelId});

    return res.status(200)
    .json(new ApiResponse(200, {totalVideos,totalSubscribers, totalViews, totalLike}, 'channel stats fetched successfully'));
   
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
      const {channelId} = req.params;
      const videos = await Video.find({owner:userId});
      if(!videos) {
        throw new ApiError(404, 'videos does not exist');
      }

      return res.status(200)
      .json(new ApiResponse(200,videos, 'videos fetched successfully'));
})

export {
    getChannelStats, 
    getChannelVideos
    }