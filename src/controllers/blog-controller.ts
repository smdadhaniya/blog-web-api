import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/custom-error";
import * as blogService from "../services/blog-service";
import { ParamsPayload } from "../utils/query-helper";

const errorHandler = (error: unknown) => {
  const err = error as Error;
  return err.message;
};

const validateBlogPost = (req: Request) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    throw new CustomError("Title, content, and author are required", 400);
  }
};

const validateComment = (req: Request) => {
  const { content, author } = req.body;
  if (!content || !author) {
    throw new CustomError("Content and author are required", 400);
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const comments = await blogService.getCommentsByPostId(postId);
    res.json(comments);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching comments", error: errorHandler(error) });
  }
};

export const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateComment(req);
    const postId = req.params.postId;
    const { author, content } = req.body;
    const newComment = await blogService.addComment(postId, author, content);
    res.status(201).json(newComment);
  } catch (error: any) {
    next(error);
  }
};

export const addBlogPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateBlogPost(req);

    const { title, content, author } = req.body;
    const newPost = await blogService.addBlogPost(title, content, author);
    res.status(201).json(newPost);
  } catch (error: any) {
    next(error);
  }
};

export const getBlogPosts = async (req: Request, res: Response) => {
  try {
    let { page = "1", limit = "10", search = "" } = req.query;
    const pageNumber = +page;
    const limitNumber = +limit;
    if (isNaN(pageNumber) || pageNumber <= 0) {
      res.status(400).json({
        message: "Invalid page number. It must be a positive integer.",
      });
    }
    if (isNaN(limitNumber) || limitNumber <= 0) {
      res.status(400).json({
        message: "Invalid limit. It must be a positive integer.",
      });
    }
    search = String(search);
    const params: ParamsPayload = {
      page: pageNumber,
      limit: limitNumber,
      search,
    };
    const posts = await blogService.getAllBlogPosts(params);
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching blog posts",
      error: errorHandler(error),
    });
  }
};

export const getBlogPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const post = await blogService.getBlogPostById(postId);
    if (!post) {
      res.status(404).json({ message: "Blog post not found" });
    }
    res.json(post);
  } catch (error: unknown) {
    res.status(500).json({
      message: "Error fetching blog post",
      error: errorHandler(error),
    });
  }
};
