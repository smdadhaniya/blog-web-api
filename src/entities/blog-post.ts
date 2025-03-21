import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Comment } from "./comment";

@Entity("blogs")
export class BlogPost {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column({ type: "text", default: null })
  title: string | undefined;

  @Column({ type: "text", default: null })
  content: string | undefined;

  @Column({ type: "text", default: null })
  author: string | undefined;

  @CreateDateColumn()
  date: Date | undefined;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[] | undefined;
}
