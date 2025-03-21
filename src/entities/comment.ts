import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { BlogPost } from "./blog-post";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column({ type: "text", default: null })
  author: string | undefined;

  @Column({ type: "text", default: null })
  content: string | undefined;

  @CreateDateColumn()
  date: Date | undefined;

  @ManyToOne(() => BlogPost, (post) => post.comments)
  post: BlogPost | undefined;
}
