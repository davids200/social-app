import { Client } from 'cassandra-driver';

export const createFeedTable = async (client: Client) => {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS feed_by_user (
      user_id UUID,
      created_at TIMESTAMP,
      post_id UUID,
      author_id UUID,
      location_id UUID,
      visibility_level INT,
      PRIMARY KEY (user_id, created_at, post_id)
    ) WITH CLUSTERING ORDER BY (created_at DESC);
  `);
};