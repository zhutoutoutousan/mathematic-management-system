-- SQL script to set up the mathematics management system database
-- This would work with PostgreSQL + pgvector for vector similarity search

-- Enable pgvector extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;

-- Create concepts table
CREATE TABLE IF NOT EXISTS concepts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    embedding vector(1536) -- OpenAI embedding dimension
);

-- Create concept relationships table (for graph connections)
CREATE TABLE IF NOT EXISTS concept_relationships (
    id SERIAL PRIMARY KEY,
    from_concept_id INTEGER REFERENCES concepts(id) ON DELETE CASCADE,
    to_concept_id INTEGER REFERENCES concepts(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50), -- 'prerequisite', 'related', 'application'
    strength DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(from_concept_id, to_concept_id, relationship_type)
);

-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    solution TEXT,
    difficulty VARCHAR(50),
    concept_id INTEGER REFERENCES concepts(id) ON DELETE CASCADE,
    solved_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    embedding vector(1536)
);

-- Create papers table
CREATE TABLE IF NOT EXISTS papers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    authors TEXT[],
    abstract TEXT,
    url VARCHAR(500),
    publication_date DATE,
    concept_id INTEGER REFERENCES concepts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    embedding vector(1536)
);

-- Create users table for multiplayer functionality
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    total_score INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    games_played INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    id SERIAL PRIMARY KEY,
    game_type VARCHAR(50), -- 'pvp' or 'pve'
    topic VARCHAR(255),
    difficulty VARCHAR(50),
    max_players INTEGER,
    status VARCHAR(50) DEFAULT 'waiting', -- 'waiting', 'active', 'completed'
    created_by INTEGER REFERENCES users(id),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create game participants table
CREATE TABLE IF NOT EXISTS game_participants (
    id SERIAL PRIMARY KEY,
    game_session_id INTEGER REFERENCES game_sessions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0,
    rank INTEGER,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_session_id, user_id)
);

-- Create user progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    concept_id INTEGER REFERENCES concepts(id) ON DELETE CASCADE,
    mastery_level DECIMAL(3,2) DEFAULT 0.0, -- 0.0 to 1.0
    problems_solved INTEGER DEFAULT 0,
    last_studied TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, concept_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_concepts_category ON concepts(category);
CREATE INDEX IF NOT EXISTS idx_concepts_difficulty ON concepts(difficulty);
CREATE INDEX IF NOT EXISTS idx_concept_relationships_from ON concept_relationships(from_concept_id);
CREATE INDEX IF NOT EXISTS idx_concept_relationships_to ON concept_relationships(to_concept_id);
CREATE INDEX IF NOT EXISTS idx_problems_concept ON problems(concept_id);
CREATE INDEX IF NOT EXISTS idx_papers_concept ON papers(concept_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);

-- Create vector similarity search indexes
CREATE INDEX IF NOT EXISTS idx_concepts_embedding ON concepts USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_problems_embedding ON problems USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_papers_embedding ON papers USING ivfflat (embedding vector_cosine_ops);

-- Insert sample data
INSERT INTO concepts (name, description, category, difficulty) VALUES
('Linear Algebra', 'Study of linear equations, vector spaces, and linear transformations', 'Algebra', 'Advanced'),
('Calculus Integration', 'Techniques and applications of integral calculus', 'Calculus', 'Intermediate'),
('Graph Theory', 'Mathematical study of graphs and their properties', 'Discrete Math', 'Advanced'),
('Probability Theory', 'Mathematical framework for analyzing random phenomena', 'Statistics', 'Intermediate'),
('Number Theory', 'Study of integers and their properties', 'Algebra', 'Advanced'),
('Differential Equations', 'Equations involving derivatives and their solutions', 'Calculus', 'Advanced');

-- Insert sample relationships
INSERT INTO concept_relationships (from_concept_id, to_concept_id, relationship_type, strength) VALUES
(1, 2, 'related', 0.7),
(2, 6, 'prerequisite', 0.8),
(3, 1, 'related', 0.6),
(4, 2, 'application', 0.5),
(5, 1, 'related', 0.4),
(6, 2, 'prerequisite', 0.9);

-- Insert sample problems
INSERT INTO problems (title, content, solution, difficulty, concept_id) VALUES
('Matrix Multiplication', 'Multiply the following 2x2 matrices: A = [[1,2],[3,4]] and B = [[5,6],[7,8]]', '[[19,22],[43,50]]', 'Intermediate', 1),
('Integration by Parts', 'Evaluate ∫x*e^x dx', 'x*e^x - e^x + C', 'Intermediate', 2),
('Graph Coloring', 'Find the chromatic number of a complete graph K5', '5', 'Advanced', 3),
('Bayes Theorem', 'Given P(A|B) = 0.8, P(B) = 0.3, P(A) = 0.5, find P(B|A)', '0.48', 'Intermediate', 4);

-- Create functions for vector similarity search
CREATE OR REPLACE FUNCTION find_similar_concepts(query_embedding vector(1536), similarity_threshold float DEFAULT 0.7, max_results int DEFAULT 10)
RETURNS TABLE(concept_id int, concept_name varchar, similarity_score float) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        (1 - (c.embedding <=> query_embedding)) as similarity
    FROM concepts c
    WHERE c.embedding IS NOT NULL
    AND (1 - (c.embedding <=> query_embedding)) > similarity_threshold
    ORDER BY c.embedding <=> query_embedding
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Create function to get learning path recommendations
CREATE OR REPLACE FUNCTION get_learning_path(user_id_param int, target_concept_id int)
RETURNS TABLE(concept_id int, concept_name varchar, mastery_level decimal, is_prerequisite boolean) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE concept_path AS (
        -- Base case: target concept
        SELECT 
            c.id,
            c.name,
            COALESCE(up.mastery_level, 0.0) as mastery,
            false as is_prereq,
            0 as depth
        FROM concepts c
        LEFT JOIN user_progress up ON c.id = up.concept_id AND up.user_id = user_id_param
        WHERE c.id = target_concept_id
        
        UNION ALL
        
        -- Recursive case: prerequisites
        SELECT 
            c.id,
            c.name,
            COALESCE(up.mastery_level, 0.0) as mastery,
            true as is_prereq,
            cp.depth + 1
        FROM concepts c
        JOIN concept_relationships cr ON c.id = cr.from_concept_id
        JOIN concept_path cp ON cr.to_concept_id = cp.concept_id
        LEFT JOIN user_progress up ON c.id = up.concept_id AND up.user_id = user_id_param
        WHERE cr.relationship_type = 'prerequisite'
        AND cp.depth < 5 -- Prevent infinite recursion
    )
    SELECT cp.concept_id, cp.concept_name, cp.mastery, cp.is_prereq
    FROM concept_path cp
    ORDER BY cp.depth DESC, cp.mastery ASC;
END;
$$ LANGUAGE plpgsql;
