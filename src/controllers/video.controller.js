import mongoose from 'mongoose';
import {Video} from '../models/video.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';



const getAllVideos = asyncHandler(async(req, res)=>{
   const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

   const filter = {};
   if(userId) {
      filter.owner = new mongoose.Types.ObjectId(userId);
   }

   if(query) {
      filter.$text = {$search:query}
   }

   const sort = {};
   if(sortBy) {
      sort[sortBy] = sortType == 'desc' ? -1: 1;
   }

   const videos = await Video.find(filter)
   .sort(sort)
   .skip((page - 1) * limit)
   .limit(limit);


   return res.status(200)
   .json(new ApiResponse(200, videos, 'video fetched successfully'));

})


const publishVideo = asyncHandler(async(req, res)=> {
     const {title, description} = req.body;
     if(!title || !description) {
        throw new ApiError(400, 'All fields are required');
     }

     const videoLocalPath = req.files?.videoFile[0]?.path;
     if(!videoLocalPath) {
        throw new ApiError(400, 'Video file is required');
     }

     const videoThumbnailLocalPath = await req.files?.thumbnail[0]?.path;
     if(!videoThumbnailLocalPath) {
        throw new ApiError(400, 'Video thumbnail file is required');
     }

     const videoUrl = await uploadOnCloudinary(videoLocalPath);
     if(!videoUrl) {
        throw new ApiError(400, 'Video file is required');
     }


     const videoThumbnailUrl = await uploadOnCloudinary(videoThumbnailLocalPath);
     if(!videoThumbnailUrl) {
        throw new ApiError(400, 'Video thumbnail file is required');
     }

     const video = await Video.create({
          videoFile:videoUrl?.url,
          thumbnail:videoThumbnailUrl?.url,
          title:title,
          description:description,
          duration:videoUrl.duration,
          owner:req.user._id,

     });


     return res.status(201)
     .json(new ApiResponse(200, video, 'Video uploaded successfully'));
})


const getVideoById = asyncHandler(async(req, res)=>{
   const {videoId} = req.params;
   
   const video = await Video.findById(videoId);
   if(!video) {
      throw new ApiError(404, 'video does not exist');
   }

   return res.status(200)
   .json(new ApiResponse(200, video, 'video fetched successfully'));
})


const updateVideo = asyncHandler(async(req, res)=>{
   const {videoId} = req.params;
   const {title, description} = req.body;

   if(!title || !description) {
      throw new ApiError(400, 'All fields are required');
   }

   const video = await Video.findById(videoId);
   if(!video) {
      throw new ApiError(404, 'video does not exist');
   }

   if(!req.user._id.equals(video.owner)) {
      throw new ApiError(401, 'Unauthorized request');
   }

   const videoLocalPath = req.files?.videoFile[0]?.path;
   if(!videoLocalPath) {
      throw new ApiError(400, 'Video file is required');
   }

   const videoThumbnailLocalPath = await req.files?.thumbnail[0]?.path;
   if(!videoThumbnailLocalPath) {
      throw new ApiError(400, 'Video thumbnail file is required');
   }

   const videoUrl = await uploadOnCloudinary(videoLocalPath);
   if(!videoUrl) {
      throw new ApiError(400, 'Video file is required');
   }


   const videoThumbnailUrl = await uploadOnCloudinary(videoThumbnailLocalPath);
   if(!videoThumbnailUrl) {
      throw new ApiError(400, 'Video thumbnail file is required');
   }


   const updateVideo = await Video.findByIdAndUpdate(
      videoId,
      {$set:{title, description,videoFile:videoUrl?.url,thumbnail:videoThumbnailUrl.url }},
      {new:true}
   );

   return res.status(200)
   .json(new ApiResponse(200, updateVideo, 'video updated successfully'));


})
      


const deleteVideo = asyncHandler(async(req, res)=>{
   const {videoId} = req.params;

   const video = await Video.findById(videoId);
   if(!video) {
      throw new ApiError(404, 'video does not exist');
   }

   if(!req.user._id.equals(video.owner)) {
      throw new ApiError(401, 'Unauthorized request');
   }

   const deletedVideo = await Video.findByIdAndDelete(videoId, {new:true});

   return res.status(200)
   .json(new ApiResponse(200, deletedVideo, 'video deleted successfully'));
})










export {
    publishVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo
    
}