const { sequelize } = require('../models');
const { DataTypes } = require('sequelize');

const migrate = async () => {
  try {
    // Create Users table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "Users" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if task_status enum type exists
    const enumExists = await sequelize.query(`
      SELECT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'task_status'
      );
    `);

    // Create enum type if it doesn't exist
    if (!enumExists[0][0].exists) {
      await sequelize.query(`
        CREATE TYPE task_status AS ENUM ('pending', 'in-progress', 'completed');
      `);
    }

    // Create Tasks table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "Tasks" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "status" task_status DEFAULT 'pending',
        "userId" INTEGER NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    // Create indexes
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS "users_email_idx" ON "Users" ("email");
      CREATE INDEX IF NOT EXISTS "tasks_userId_idx" ON "Tasks" ("userId");
    `);

    console.log('Database tables and indexes created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  }
};

module.exports = migrate; 