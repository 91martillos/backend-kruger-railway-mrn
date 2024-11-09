import mongoose from "mongoose";

//comentario de estructura
//{
//    user: "1234"
//   message: "hola"
//   createdAt: Date.now
//}

//de alguna manera debemos poder llegar a obtener la info del user que hizo el comment
//{
//    user: {
//        username: "1234"
//        email: "pedro"
//    }
//    message: "hola"
//    createdAt: Date.now
//}

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Comment = mongoose.model("Comment", commentSchema);
