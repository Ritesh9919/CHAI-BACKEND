import {Like} from '../models/like.model.js';
import {Video} from '../models/video.model.js';
import {Comment} from '../models/comment.model.js';
import {Tweet} from '../models/tweet.model.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';



const toggleVideoLike = asyncHandler(async(req, res)=>{
      const {videoId} = req.params;
      const video = await Video.findById(videoId);

      if(!video) {
        throw new ApiError(404, 'video does not exist');
      }

      const isLikeExist = await Like.findOne({video:videoId, likedBy:req.user._id});
      if(isLikeExist) {
        await isLikeExist.deleteOne();
        return res.status(200)
        .json(new ApiResponse(200, {}, 'toggleLike successfully'));
      }

      const like = await Like.create({likedBy:req.user._id, video:videoId});

      return res.status(201)
      .json(new ApiResponse(200, like, 'toggle like successfully'));
})

const toogleCommentLike = asyncHandler(async(req, res)=>{
    const {commentId} = req.params;
    const comment = await Comment.findById(commentId);

    if(!comment) {
      throw new ApiError(404, 'comment does not exist');
    }

    const isLikeExist = await Like.findOne({comment:commentId, likedBy:req.user._id});
    if(isLikeExist) {
      await isLikeExist.deleteOne();
      return res.status(200)
      .json(new ApiResponse(200, {}, 'toggleLike successfully'));
    }

    const like = await Like.create({likedBy:req.user._id, video:videoId});

    return res.status(201)
    .json(new ApiResponse(200, like, 'toggle like successfully'));


})


const toogleTweetLike = asyncHandler(async(req, res)=>{
    const {tweetId} = req.params;
    const tweet = await Tweet.findById(tweetId);

    if(!tweet) {
      throw new ApiError(404, 'tweet does not exist');
    }

    const isLikeExist = await Like.findOne({tweet:tweetId, likedBy:req.user._id});
    if(isLikeExist) {
      await isLikeExist.deleteOne();
      return res.status(200)
      .json(new ApiResponse(200, {}, 'toggleLike successfully'));
    }

    const like = await Like.create({likedBy:req.user._id, video:videoId});

    return res.status(201)
    .json(new ApiResponse(200, like, 'toggle like successfully'));
})




const getLikedVideos = asyncHandler(async(req, res)=> {
     const likedVideos = await Like.find({likedBy:req.user._id}).populate('video');
     if(!likedVideos) {
        throw new ApiError(404, 'like does not exist');
     }

     return res.status(200)
     .json(new ApiResponse(200, likedVideos, 'liked video fetched successfully'));
})




export {
    toggleVideoLike,
    toogleCommentLike,
    toogleTweetLike,
    getLikedVideos
}