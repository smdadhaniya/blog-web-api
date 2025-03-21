import { Router } from "express";
import {
  addBlogPost,
  addComment,
  getBlogPost,
  getBlogPosts,
  getComments,
} from "../controllers/blog-controller";

const router = Router();

router.get("/posts", getBlogPosts);
router.get("/post/:id", getBlogPost);
router.post("/post", addBlogPost);

router.get("/post/:postId/comments", getComments);
router.post("/post/:postId/comment", addComment);

export default router;
