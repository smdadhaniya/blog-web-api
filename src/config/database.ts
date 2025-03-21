import { DataSource } from "typeorm";
import { BlogPost } from "../entities/blog-post";
import { Comment } from "../entities/comment";
import dotenv from "dotenv";

dotenv.config();

export let dataSource: DataSource;

export const connectDatabase = async () => {
  const databaseName = process.env.POSTGRES_DB_DATABASE!;
  try {
    const tempConnection = new DataSource({
      type: "postgres",
      host: process.env.POSTGRES_DB_HOST,
      port: +(process.env.POSTGRES_DB_PORT || "5432"),
      username: process.env.POSTGRES_DB_USERNAME,
      password: process.env.POSTGRES_DB_PASSWORD,
      database: "postgres",
      logging: false,
    });
    console.log("Connected to PostgreSQL server.");
    await tempConnection.initialize();
    const queryRunner = tempConnection.createQueryRunner();
    const result = await queryRunner.query(
      `SELECT 1 FROM pg_database WHERE datname = $1;`,
      [databaseName]
    );
    if (result.length === 0) {
      await queryRunner.query(`CREATE DATABASE ${databaseName};`);
    }
    await tempConnection.destroy();
    dataSource = new DataSource({
      type: "postgres",
      host: process.env.POSTGRES_DB_HOST,
      port: +(process.env.POSTGRES_DB_PORT || "5432"),
      username: process.env.POSTGRES_DB_USERNAME,
      password: process.env.POSTGRES_DB_PASSWORD,
      database: process.env.POSTGRES_DB_DATABASE,
      entities: [BlogPost, Comment],
      synchronize: true,
    });
    console.log("Initializing data source...");
    await dataSource.initialize();
    console.log("Database connection successful.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};
