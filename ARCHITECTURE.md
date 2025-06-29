# Math-Core Platform Architecture

## Product Ecosystem Overview

The Math-Core ecosystem consists of multiple interconnected products sharing a centralized data platform (数据中台). This architecture document outlines how these products work together to create a comprehensive mathematics learning environment.

### Product Architecture
```mermaid
graph TB
    subgraph "Frontend Products"
        MMP["Math Management Platform<br/>(Next.js)"]
        subgraph "Textbook Sites"
            TB1["Calculus Site<br/>(Next.js)"]
            TB2["Linear Algebra Site<br/>(Next.js)"]
            TB3["Future Textbooks<br/>(Next.js)"]
        end
    end

    subgraph "Core Platform"
        API["API Gateway<br/>(NestJS)"]
        WS["WebSocket Server<br/>(Socket.io)"]
        
        subgraph "Services"
            AUTH["Auth Service"]
            CONCEPT["Concept Service"]
            COMP["Competition Service"]
            PROG["Progress Service"]
            CHAT["Chat Service"]
        end
        
        subgraph "Data Layer"
            PDB[(Prisma DB<br/>User Data)]
            GDB[(Dgraph<br/>Concept Graph)]
            VDB[(Pinecone<br/>Vectors)]
            RDB[(Supabase<br/>Real-time)]
        end
    end

    MMP --> API
    MMP --> WS
    TB1 & TB2 & TB3 --> API
    TB1 & TB2 & TB3 --> WS

    API --> AUTH & CONCEPT & COMP & PROG & CHAT
    WS --> CHAT

    AUTH & PROG --> PDB
    CONCEPT --> GDB
    CONCEPT --> VDB
    CHAT --> RDB
```

### Data Flow Architecture
```mermaid
flowchart LR
    subgraph "User Interactions"
        L["Learning"]
        P["Practice"]
        C["Compete"]
        S["Socialize"]
    end

    subgraph "Core Services"
        TS["Textbook Service"]
        CS["Concept Service"]
        PS["Progress Service"]
        MS["Multiplayer Service"]
    end

    subgraph "Data Storage"
        D1[(User Data)]
        D2[(Concept Graph)]
        D3[(Vector Store)]
        D4[(Real-time Data)]
    end

    L --> TS --> D1
    P --> CS --> D2
    C --> MS --> D4
    S --> PS --> D3
```

## System Evolution

### MVP Stage (0-6 months)
- Core platform with basic services
- One textbook site implementation
- Basic management platform
- Essential multiplayer features

### Growth Stage (6-12 months)
- Multiple textbook sites
- Enhanced competition system
- Advanced concept mapping
- Improved real-time features

### Scale Stage (12+ months)
- Automated textbook integration
- Advanced AI features
- Global deployment
- Enhanced analytics

## Implementation Strategy

### 1. Core Platform Development
```mermaid
gantt
    title Core Platform Implementation
    dateFormat  YYYY-MM-DD
    section Infrastructure
    Setup Base Architecture    :2024-04-01, 30d
    Database Implementation    :2024-04-15, 45d
    API Development           :2024-05-01, 60d
    
    section Services
    Auth Service             :2024-04-15, 30d
    Concept Service          :2024-05-01, 45d
    Competition Service      :2024-05-15, 45d
    Progress Service         :2024-06-01, 30d
    
    section Integration
    Textbook Integration     :2024-06-15, 45d
    Platform Integration     :2024-07-01, 45d
```

### 2. Textbook Site Template
- Standardized Next.js template
- Shared components library
- Consistent styling system
- Integration patterns

### 3. Management Platform
- Concept visualization
- Competition management
- Progress tracking
- Community features

## Technical Stack

### Frontend (All Products)
- Next.js for web applications
- Tailwind CSS for styling
- Socket.io for real-time
- Shared component library

### Backend (Core Platform)
- NestJS for microservices
- GraphQL + REST APIs
- WebSocket integration
- Service mesh architecture

### Data Layer
- PostgreSQL (Prisma)
- Dgraph
- Pinecone
- Supabase

### Infrastructure
- Docker containers
- Kubernetes orchestration
- CI/CD pipelines
- Monitoring system

## Security Architecture

### Authentication Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant S as Services
    participant D as Database

    U->>F: Login Request
    F->>A: Authenticate
    A->>D: Verify Credentials
    D-->>A: User Data
    A->>A: Generate JWT
    A-->>F: Auth Token
    F->>S: API Requests
    S->>S: Validate Token
```

## Monitoring and Analytics

### Data Collection
- User learning patterns
- Competition metrics
- System performance
- Error tracking

### Analysis
- Learning effectiveness
- Feature usage
- Performance metrics
- User engagement

## Deployment Strategy

### MVP Deployment
- Single region
- Basic scaling
- Essential monitoring
- Core features only

### Growth Deployment
- Multi-region support
- Advanced scaling
- Full monitoring
- Feature expansion

### Scale Deployment
- Global CDN
- Auto-scaling
- Predictive analytics
- Advanced features
