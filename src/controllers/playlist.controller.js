import {Playlist} from '../models/playlist.model.js';
import {Video} from '../models/video.model.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {asyncHandler} from '../utils/asyncHandler.js';



const createPlaylist = asyncHandler(async(req, res)=> {
     const {name, description} = req.body;

     if(!name || !description) {
        throw new ApiError(400, 'all fields are required');
     }

     const playlist = await Playlist.create({
        name,
        description,
        owner:req.user._id
     })

     return res.status(201)
     .json(new ApiResponse(200, playlist, 'playlist created successfully'));
})


const getUserPlaylists = asyncHandler(async(req, res)=> {
   const {userId} = req.params;

   const playlists = await Playlist.find({owner:userId}).populate('videos');
  if(!playlists) {
   throw new ApiError(404, 'playlists does not exist');
  }

   return res.status(200)
   .json(new ApiResponse(200, playlists, 'playlists fetched successfully'));
})


const getPlaylistById = asyncHandler(async(req, res)=> {
   const {playlistId} = req.params;

   const playlist = await Playlist.findById(playlistId);
   if(!playlist) {
      throw new ApiError(404, 'playlist does not exist');
   }

   return res.status(200)
   .json(new ApiResponse(200, playlist, 'playlist fetched successfully'));
})


const addVideoToPlaylist = asyncHandler(async(req, res)=> {
    const {playlistId, videoId} = req.query;
     
    const playlist = await Playlist.findById(playlistId);
    
    if(!playlist) {
      throw new ApiError(404, 'playlist does not exist');
    }

    if(!playlist.owner.equals(req.user._id) ) {
       throw new ApiError(401, 'Unauthorized request');
    }

    playlist.videos.push(videoId);
    await playlist.save()

    return res.status(200)
    .json(new ApiResponse(200, playlist, 'video added to playlist successfully'));


})


const removeVideoFromPlaylist = asyncHandler(async(req, res)=> {
    const {playlistId, videoId} = req.query;

    const playlist = await Playlist.findById(playlistId);
    if(!playlist) {
      throw new ApiError(404, 'playlist does not exist');
    }

    if(!playlist.owner.equals(req.user._id)) {
      throw new ApiError(401, 'Unauthorized request');
    }

    playlist.videos.pull(videoId);
    await playlist.save();

    return res.status(200)
    .json(new ApiResponse(200, playlist, 'video deleted successfylly'));
})

const updatePlaylist = asyncHandler(async(req, res)=> {
     const {playlistId} = req.params;
     const {name, description } = req.body;

     if(!name || !description) {
      throw new ApiError(400, 'all fields are required');
     }

     const playlist = await Playlist.findById(playlistId);
     if(!playlist) {
      throw new ApiError(404, 'playlist does not exist');
     }

     if(!playlist.owner.equals(req.user._id)) {
      throw new ApiError(401, 'Unauthorized request');
     }

     const updatedPlaylist = await Playlist.findByIdAndUpdate(
      playlistId,
      {$set:{name, description}},
      {new:true}
     )

      return res.status(200)
      .json(new ApiResponse(200, updatedPlaylist, 'playlist updated successfully'));

})

const deletePlaylist = asyncHandler(async(req, res)=> {
    const {playlistId} = req.params;
    const playlist = await Playlist.findById(playlistId);

    if(!playlist) {
      throw new ApiError(404, 'playlist does not exist');
    }

    if(!playlist.owner.equals(req.user._id)) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId, {new:true});

    return res.status(200)
    .json(new ApiResponse(200, deletedPlaylist, 'playlist deleted successfully'));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist
}