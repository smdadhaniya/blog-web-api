import { dataSource } from "../config/database";
import { BlogPost } from "../entities/blog-post";
import { Comment } from "../entities/comment";
import { ParamsPayload, QueryHelper, QueryParams } from "../utils/query-helper";

export const addBlogPost = async (
  title: string,
  content: string,
  author: string
) => {
  const blogPostRepository = dataSource.getRepository(BlogPost);
  const newBlogPost = new BlogPost();
  newBlogPost.title = title;
  newBlogPost.content = content;
  newBlogPost.author = author;
  newBlogPost.date = new Date();
  return await blogPostRepository.save(newBlogPost);
};

export const getAllBlogPosts = async (params: ParamsPayload) => {
  const blogPostRepository = dataSource.getRepository(BlogPost);
  const blogs = await blogPostRepository.find();
  const { page = 1, limit = 10, search = "" } = params;
  const queryParams: QueryParams<BlogPost> = {
    page,
    limit,
    search,
    searchFields: ["title", "content"],
  };
  const queryHelper = new QueryHelper(blogs);
  const result = queryHelper.applyQuery(queryParams);
  return result;
};

export const getBlogPostById = async (id: string) => {
  const blogPostRepository = dataSource.getRepository(BlogPost);
  return await blogPostRepository.findOne({
    where: { id: id },
    relations: ["comments"],
  });
};

export const getCommentsByPostId = async (postId: string) => {
  const commentRepository = dataSource.getRepository(Comment);
  return await commentRepository.find({ where: { post: { id: postId } } });
};

export const addComment = async (
  postId: string,
  author: string,
  content: string
) => {
  const commentRepository = dataSource.getRepository(Comment);
  const blogPostRepository = dataSource.getRepository(BlogPost);
  const post = await blogPostRepository.findOne({ where: { id: postId } });
  if (!post) throw new Error("Blog post not found");

  const newComment = new Comment();
  newComment.author = author;
  newComment.content = content;
  newComment.post = post;

  return await commentRepository.save(newComment);
};
