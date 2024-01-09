import {Subcription} from '../models/subcription.model.js';
import {User} from '../models/user.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';


const toggleSubscription = asyncHandler(async(req, res)=> {
    const {channelId} = req.params;
    if(!channelId) {
        throw new ApiError(400, 'Channel id is required');
    }

    const user = await User.findById(req.user._id);
    if(!user) {
        throw new ApiError(404, 'user does not exist');
    }

    

    const subcriptions = await Subcription.findOne({subscriber:req.user._id, channel:channelId});
    
    
    if(subcriptions) {
      await Subcription.findOneAndDelete({subscriber:req.user._id, channel:channelId})
      await Subcription.findByIdAndUpdate(channelId, {$pull:{subscriber:req.user._id}},{new:true})
        return res.status(201)
    .json(new ApiResponse(200, 'channel unsubscribe successfuuly'));
    }

    const subcription = await Subcription.create({
        subscriber:req.user._id,
        channel:channelId
    })

    return res.status(201)
    .json(new ApiResponse(200, subcription, 'channel subscribe successfuuly'));
})


const getUserChannelSubscribers = asyncHandler(async(req, res)=> {
    const {channelId} = req.params;

   const subscribers = await Subcription.find({channel:channelId}).populate({
    path:'subscriber',
    select:'-refreshToken -password'
   });
   
   if(!subscribers) {
    throw new ApiError(404, 'subscriber does not exist');
   }

   return res.status(200)
   .json(new ApiResponse(200, subscribers, 'subscribers fetched successfully'));

})


const getSubscribedChannels = asyncHandler(async(req, res)=> {
    const {subscriberId} = req.params;

    const subscribedChannels = await Subcription.find({subscriber:subscriberId}).populate({
        path:'channel',
        select:'-refreshToken -password'
    });
    if(!subscribedChannels) {
        throw new ApiError(404, 'subscribed channel does not exist');
    }

    return res.status(200)
    .json(new ApiResponse(200, subscribedChannels, 'subscribed channel fetched successfully'));

})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}


