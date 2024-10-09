const Blog = require("../models/blog");
const User = require("../models/user");

const methods = require("./crud");

exports.likes = async (req, res) => {
  const { blogId } = req.body;
  //validateMongoDbId(blogId);

  const blog = await Blog.findById(blogId);
  const loginUserId = req.user._id;
  const isLiked = blog.isLiked;
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId.toString() === loginUserId.toString()
  );
  if (alreadyDisliked) {
    await Blog.findByIdAndUpdate( blogId, {
      $pull: { dislikes: loginUserId },
      isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isLiked) {

    await Blog.findByIdAndUpdate( blogId, {
      $pull: { likes: loginUserId },
      isLiked: false },
      { new: true })
        .then((blog) => {
          res.status(200).json({success: true, result: blog});
        })
        .catch((error) => {
          res.status(400).json({success: false, error});
      });

  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
};

exports.dislikes = async (req, res) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);

  const blog = await Blog.findById(blogId);
  const loginUserId = req.user._id;
  const isDisLiked = blog.isDisliked;
  const alreadyLiked = blog.likes.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(blog);
  }
  if (isDisLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
};

exports.sections = async (req, res) => {
  const categories = ['Marketing', 'Nextjs', 'React', 'Nodejs', 'Tailwindcss'];
  return res.json({ sections: categories, success:true });
}

const crud = methods.crudController( Blog );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}

