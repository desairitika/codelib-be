const {
   getAllComments,
   createComment,
   getCommentById,
   updateCommentById,
   deleteCommentById,
 } = require("../data/mongoose/comment");
 const { dbErrorHandler } = require("../utils/errorHandler");
 const { getResponseStructure } = require("../utils/helper");
 
 class CommentService {
   static async getAllComments(solutionId) {
     try {
       const comments = await getAllComments(solutionId);
       return getResponseStructure(200, "message", "Success", comments);
     } catch (err) {
       return dbErrorHandler(err);
     }
   }
 
   static async createComment(data) {
     try {
       const comment = await createComment(data);
       return getResponseStructure(201, "message", "Comment created successfully", comment);
     } catch (err) {
       return dbErrorHandler(err);
     }
   }
 
   static async getCommentById(commentId) {
     try {
       const comment = await getCommentById(commentId);
       return getResponseStructure(200, "message", "Success", comment);
     } catch (error) {
       return dbErrorHandler(error);
     }
   }
 
   static async updateComment(commentId, body) {
     try {
       if(!Object.keys(body).length){
         return getResponseStructure(204, "message", "");
       }
       const updatedComment = await updateCommentById(commentId, body);
       return getResponseStructure(200, "message", "Comment updated successfully", updatedComment);
     } catch (error) {
       return dbErrorHandler(error);
     }
   }
 
   static async deleteComment(commentId) {
     try {
       await deleteCommentById(commentId);
       return getResponseStructure(204, "message", "Comment Deleted Successful.");
     } catch (err) {
       return dbErrorHandler(err);
     }
   }
 }
 
 module.exports = CommentService;
 