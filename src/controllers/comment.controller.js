import {Comment} from '../models/comment.model.js';
import {Video} from '../models/video.model.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';


const getVideoComments = asyncHandler(async(req, res)=> {
     const {videoId} = req.params;
    
     const video = await Video.findById(videoId);

     if(!video) {
        throw new ApiError(404, 'video does not exist');
     }
     let comments = Comment.find({video:videoId});

     if(!comments) {
        throw new ApiError(404, 'comments does not exist');
     }

     const page = req.query.page || 1;
     const limit = req.query.limit || 10;
     const skip = (page - 1) * limit;

      comments = await comments.skip(skip).limit(limit);

     return res.status(200)
     .json(new ApiResponse(200, comments, 'comments fetched successfully'));


})


const addComment = asyncHandler(async(req, res)=> {
   const {videoId} = req.params; 
   const {content} = req.body;

   const video = await Video.findById(videoId);
   if(!video) {
    throw new ApiError(404, 'video does not exist');
   }

   const comment = await Comment.create({content, video:videoId,owner:req.user._id });
   return res.status(201)
   .json(new ApiResponse(200, comment, 'comment created successfully'));
    
})


const updateComment = asyncHandler(async(req, res)=> {
    const {commentId} = req.params;
    const {content} = req.body;

    const comment = await Comment.findById(commentId);
    if(!comment) {
        throw new ApiError(404, 'comment does not exist');
    }

    if(!comment.owner.equals(req.user._id)) {
        throw new ApiError(401, 'Unauthorized request');
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {$set:{content:content}},
        {new:true}
    )

    return res.status(200)
    .json(new ApiResponse(200, updatedComment, 'comment updated successfully'));
})


const deleteComment = asyncHandler(async(req, res)=> {
    const {commentId} = req.params;
    

    const comment = await Comment.findById(commentId);
    if(!comment) {
        throw new ApiError(404, 'comment does not exist');
    }

    if(!comment.owner.equals(req.user._id)) {
        throw new ApiError(401, 'Unauthorized request');
    }

    const deletedComment = await Comment.findByIdAndDelete(
        commentId,
        {new:true}
    )

    return res.status(200)
    .json(new ApiResponse(200, deletedComment, 'comment deleted successfully'));
})



export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}