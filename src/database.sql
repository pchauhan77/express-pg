CREATE DATABASE todo_database;

CREATE TABLE todo(
 todo_id SERIAL PRIMARY KEY,
 description VARCHAR(255),
 user_id SERIAL REFERENCES users(id)
);

CREATE TABLE users(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_role VARCHAR(255) DEFAULT 'user' NOT NULL,
  is_email_verified BOOLEAN NOT NULL
);

CREATE TABLE token(
  token VARCHAR(255) PRIMARY KEY,
  user_id SERIAL REFERENCES users(id),
  type VARCHAR(255) NOT NULL,
  expires DATE NOT NULL,
  blacklisted BOOLEAN DEFAULT false NOT NULL
);