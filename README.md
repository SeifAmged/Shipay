# 🚀 Shipay - Professional Digital Wallet Platform

<div align="center">
  <img src="https://github.com/SeifAmged/Shipay/blob/main/frontend/public/favicon.png?raw=true" alt="Shipay Logo" width="120"/>

  <p><strong>A modern, enterprise-grade digital wallet application built with React and Django</strong></p>

  <a href="https://djangoproject.com/"><img src="https://img.shields.io/badge/Django-5.2.6-green.svg" alt="Django Badge"/></a>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.0-blue.svg" alt="React Badge"/></a>
  <a href="https://postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-15-blue.svg" alt="PostgreSQL Badge"/></a>
  <a href="https://docker.com/"><img src="https://img.shields.io/badge/Docker-Ready-blue.svg" alt="Docker Badge"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License Badge"/></a>
</div>


## ✨ Features

### 💰 Core Financial Features
- **🔐 Secure Authentication**: JWT-based authentication with automatic token refresh
- **💳 Wallet Management**: Real-time balance tracking with secure transactions
- **💸 Money Transfers**: Instant peer-to-peer transfers between users
- **📊 Transaction History**: Comprehensive transaction tracking with advanced filtering
- **👁️ Balance Reveal**: Unique feature with daily free reveals and paid options
- **🔄 Real-time Updates**: Live balance and transaction updates

### 🌍 User Experience
- **🌐 Multi-language Support**: English and Arabic with intelligent context-aware translations
- **📱 Mobile-First Design**: Fully responsive interface optimized for all devices
- **⚡ Real-time Validation**: Instant client-side and server-side form validation
- **🎨 Modern UI/UX**: Professional fintech-style interface with smooth animations
- **🔒 Enterprise Security**: Rate limiting, brute force protection, and data encryption

### 🛠️ Technical Excellence
- **🏗️ RESTful API**: Well-structured Django REST Framework backend
- **🗄️ Database**: PostgreSQL with optimized relationships and constraints
- **⚡ Performance**: Redis caching and database optimization
- **🔐 Security**: Django Axes, CORS protection, and input validation
- **🐳 Production Ready**: Complete Docker setup with Nginx reverse proxy
- **📈 Scalable**: Microservices-ready architecture with health checks

## 🛠️ Tech Stack

### Frontend Technologies
- **⚛️ React 18** - Modern functional components with hooks
- **🛣️ React Router** - Client-side routing and navigation
- **🎭 Framer Motion** - Smooth animations and transitions
- **🌐 Axios** - HTTP client with automatic token refresh
- **🎨 CSS3** - Modern responsive design with professional styling
- **⚡ Vite** - Lightning-fast development and building
- **📱 Responsive Design** - Mobile-first approach with breakpoints

### Backend Technologies
- **🐍 Django 5.2** - High-level Python web framework
- **🔌 Django REST Framework** - Powerful API development
- **🐘 PostgreSQL 15** - Robust relational database
- **⚡ Redis 7** - In-memory caching and session storage
- **🔐 JWT Authentication** - Secure token-based authentication
- **🛡️ Django Axes** - Brute force protection and rate limiting
- **🌐 CORS Headers** - Cross-origin resource sharing
- **📊 Django Filter** - Advanced query filtering

### DevOps & Infrastructure
- **🐳 Docker** - Containerization and orchestration
- **🔄 Docker Compose** - Multi-container application management
- **🌐 Nginx** - Reverse proxy and static file serving
- **📈 Health Checks** - Service monitoring and reliability
- **🔒 SSL/TLS** - Secure communication protocols
- **📊 Logging** - Comprehensive application logging

## Project Structure

```
shipay/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts (Auth, Language)
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Utility functions and validation
│   │   └── styles/         # CSS stylesheets
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Django backend
│   ├── api/                # Main API app
│   │   ├── models.py       # Database models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # Data serializers
│   │   └── urls.py         # URL routing
│   ├── shipay_project/     # Django project settings
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile         # Docker configuration
│   └── docker-compose.yml # Docker services
└── DEPLOYMENT.md          # Deployment instructions
```

## 🚀 Quick Start

### 🐳 Docker Deployment (Recommended)

The easiest way to get Shipay running is with Docker:

1. **Clone the repository**
   ```bash
   git clone https://github.com/SeifAmged/Shipay.git
   cd shipay
   ```

2. **Configure environment**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Create superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/

6. **Seed with test data (Optional)**
   ```bash
   docker-compose exec backend python manage.py seed_data
   ```

### 🛠️ Manual Development Setup

#### Prerequisites
- **Node.js 18+** - For frontend development
- **Python 3.11+** - For backend development
- **PostgreSQL 15+** - Database
- **Redis 7+** - Caching (optional for development)

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp env.example .env
   # Edit .env with your database and Redis settings
   ```

5. **Set up database**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

7. **Seed with test data (Optional)**
   ```bash
   python manage.py seed_data
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to `http://localhost:3000`

## 📚 API Documentation

### 🔐 Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register/` | User registration | ❌ |
| `POST` | `/api/auth/login/` | User login | ❌ |
| `POST` | `/api/auth/refresh/` | Refresh JWT token | ❌ |

### 💳 Wallet Operations
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/wallet/` | Get wallet information | ✅ |
| `POST` | `/api/deposit/` | Deposit funds | ✅ |
| `POST` | `/api/withdraw/` | Withdraw funds | ✅ |
| `POST` | `/api/transfer/` | Transfer funds to another user | ✅ |
| `POST` | `/api/reveal-balance/` | Reveal balance (with fee logic) | ✅ |

### 📊 Transaction Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/transactions/` | Get transaction history with filtering | ✅ |

### 🔍 Query Parameters
- **Transaction Filtering**: `?transaction_type=deposit&start_date=2024-01-01&end_date=2024-12-31`
- **Pagination**: `?page=1&page_size=10`
- **Sorting**: `?ordering=-created_at` (newest first)

## 🚀 Production Deployment

### 🐳 Docker Production Setup

1. **Configure production environment**
   ```bash
   cd backend
   cp env.example .env
   # Update .env with production values
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Run database migrations**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

4. **Create superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

5. **Collect static files**
   ```bash
   docker-compose exec backend python manage.py collectstatic --noinput
   ```

### 🌐 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SECRET_KEY` | Django secret key | - | ✅ |
| `DEBUG` | Debug mode | `False` | ✅ |
| `DB_NAME` | Database name | `shipay_db` | ✅ |
| `DB_USER` | Database user | `shipay_user` | ✅ |
| `DB_PASSWORD` | Database password | - | ✅ |
| `REDIS_URL` | Redis connection URL | `redis://redis:6379/1` | ✅ |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` | ✅ |
| `ALLOWED_HOST` | Allowed hosts | `localhost,127.0.0.1` | ✅ |

### 🔒 Security Considerations

- **Change default passwords** in production
- **Use HTTPS** with SSL certificates
- **Configure proper CORS** origins
- **Set up firewall** rules
- **Regular security updates**
- **Monitor logs** for suspicious activity
- **Backup database** regularly
- **Use environment variables** for sensitive data

## 🧪 Testing & Development Tools

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Docker Testing
```bash
docker-compose exec backend python manage.py test
```

### 🛠️ Management Commands

Shipay includes several Django management commands for development and maintenance:

#### Database Seeding
```bash
# Populate database with realistic test data
python manage.py seed_data
```

#### Database Management
```bash
# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic
```

#### Development Utilities
```bash
# Django shell
python manage.py shell

# Check project status
python manage.py check

# Show migrations status
python manage.py showmigrations
```

## 🌱 Database Seeding & Development Data

### 📊 Seed Data Management Command

Shipay includes a powerful database seeding system for development and testing purposes. The `seed_data.py` management command creates a realistic dataset that simulates real-world usage patterns.

#### 🚀 Quick Start - Seed Database
```bash
# Using Docker
docker-compose exec backend python manage.py seed_data

# Using local development
cd backend
python manage.py seed_data
```

#### 🎯 What the Seed Command Creates

The seed command generates a comprehensive dataset including:

##### 👥 **User Generation (20 Users)**
- **Realistic Names**: Egyptian/Arabic first and last names
- **Unique Usernames**: Format: `firstname1`, `firstname2`, etc.
- **Default Password**: `qwe` (for easy testing)
- **Email Addresses**: `user1@test.com`, `user2@test.com`, etc.
- **Random Balances**: Between 2,000 - 10,000 EGP per user
- **Wallet Creation**: Automatic wallet creation for each user

##### 💰 **Transaction Generation (2,000+ Transactions)**
- **100 Transactions per User**: Realistic transaction history
- **Transaction Types**: Deposits, withdrawals, and transfers
- **Random Amounts**: Between 10 - 500 EGP per transaction
- **Realistic Timing**: Transactions spread across 2024 to present
- **Proper Balance Tracking**: Maintains accurate wallet balances
- **Transfer Logic**: Users can transfer money to each other

##### 🤖 **Bonus Bot System**
- **Bot User**: `shipay_bonus_bot` with password `2468`
- **Unlimited Balance**: 9,999,999,999.99 EGP for testing
- **Welcome Bonuses**: New users receive 1,000 EGP welcome bonus
- **Signal Integration**: Automatic bonus distribution on user registration

#### 🔧 **Technical Implementation Details**

##### **Signal Management**
```python
# Temporarily disconnects welcome bonus signal during seeding
post_save.disconnect(create_wallet_and_give_bonus, sender=User)
# ... seeding process ...
# Reconnects signal for normal operation
post_save.connect(create_wallet_and_give_bonus, sender=User)
```

##### **Atomic Transactions**
- **Database Integrity**: All operations wrapped in atomic transactions
- **Rollback Safety**: If any operation fails, entire seed process rolls back
- **Performance**: Bulk operations for optimal database performance

##### **Realistic Data Patterns**
- **Name Generation**: Culturally appropriate Egyptian names
- **Transaction Distribution**: Realistic mix of transaction types
- **Balance Logic**: Proper balance calculations and constraints
- **Date Randomization**: Transactions spread across realistic time periods

#### 📈 **Use Cases**

##### **Development Environment**
- **Quick Setup**: Populate database with test data instantly
- **Feature Testing**: Test features with realistic data volumes
- **UI Development**: Develop with realistic transaction histories
- **Performance Testing**: Test with substantial data volumes

##### **Demo & Presentation**
- **Live Demonstrations**: Show real transaction flows
- **User Experience**: Demonstrate with realistic user scenarios
- **Feature Showcase**: Highlight all application features
- **Client Presentations**: Professional demo environment

##### **Testing Scenarios**
- **Load Testing**: Test with 2,000+ transactions
- **Edge Cases**: Test various transaction combinations
- **Balance Scenarios**: Test different wallet balance levels
- **Transfer Testing**: Test peer-to-peer transfers

#### 🛠️ **Advanced Usage**

##### **Custom Seeding**
```python
# Modify the seed_data.py command for custom requirements
# - Change number of users (currently 20)
# - Adjust transaction count per user (currently 100)
# - Modify balance ranges (currently 2,000-10,000 EGP)
# - Customize transaction amounts (currently 10-500 EGP)
```

##### **Clean Slate Seeding**
```bash
# The command automatically cleans existing non-superuser data
# Superusers are preserved for admin access
python manage.py seed_data
```

##### **Production Safety**
- **Superuser Protection**: Never deletes admin users
- **Signal Management**: Properly manages Django signals
- **Error Handling**: Graceful error handling and rollback
- **Logging**: Comprehensive progress reporting

#### 📊 **Generated Dataset Statistics**

| Metric | Value | Description |
|--------|-------|-------------|
| **Users** | 20 | Realistic user accounts |
| **Transactions** | 2,000+ | Comprehensive transaction history |
| **Balance Range** | 2,000 - 10,000 EGP | Realistic wallet balances |
| **Transaction Amounts** | 10 - 500 EGP | Realistic transaction sizes |
| **Time Period** | 2024 - Present | Current year data |
| **Transaction Types** | 3 | Deposits, withdrawals, transfers |
| **Bot Balance** | 9,999,999,999.99 EGP | Unlimited testing funds |

#### 🔍 **Verification Commands**

After seeding, verify the data:

```bash
# Check user count
python manage.py shell -c "from django.contrib.auth.models import User; print(f'Users: {User.objects.count()}')"

# Check transaction count
python manage.py shell -c "from api.models import Transaction; print(f'Transactions: {Transaction.objects.count()}')"

# Check bot balance
python manage.py shell -c "from api.models import Wallet; bot = Wallet.objects.get(user__username='shipay_bonus_bot'); print(f'Bot Balance: {bot.balance}')"
```

#### ⚠️ **Important Notes**

- **Development Only**: This command is designed for development/testing
- **Data Overwrite**: Cleans existing non-superuser data
- **Signal Management**: Temporarily disables welcome bonus signals
- **Performance**: May take a few minutes to complete
- **Memory Usage**: Creates substantial database records

This seeding system provides a robust foundation for development, testing, and demonstration of the Shipay platform with realistic, comprehensive data that showcases all features effectively.

## 📈 Monitoring & Maintenance

### Health Checks
- **Backend**: `GET /health/`
- **Database**: Automatic health checks in Docker
- **Redis**: Automatic health checks in Docker

### Logging
- **Application logs**: `/app/logs/django.log`
- **Nginx logs**: Available in Docker logs
- **Database logs**: Available in Docker logs

### Backup
```bash
# Database backup
docker-compose exec db pg_dump -U shipay_user shipay_db > backup.sql

# Restore database
docker-compose exec -T db psql -U shipay_user shipay_db < backup.sql
```

## 🎯 Key Features Explained

### 🌐 Multi-language Support
The application features intelligent context-aware translation system supporting English and Arabic. Only specific UI elements are translated, maintaining the technical integrity while providing seamless experience for Arabic-speaking users.

### 👁️ Balance Reveal Feature
A unique fintech feature with smart economics:
- **Free Tier**: First 3 reveals per day are completely free
- **Premium Tier**: Additional reveals cost 10 EGP per reveal
- **Daily Reset**: Automatic reset of free reveals at midnight
- **Visual Feedback**: Professional popup notifications with animations

### 🔒 Enterprise Security
- **JWT Authentication**: Secure token-based authentication with automatic refresh
- **Rate Limiting**: Django Axes protection against brute force attacks
- **Input Validation**: Comprehensive client-side and server-side validation
- **CORS Protection**: Secure cross-origin resource sharing
- **Data Encryption**: SQL injection and XSS protection
- **Session Management**: Secure session handling with Redis

### 📱 Mobile-First Design
- **Responsive Breakpoints**: Optimized for all screen sizes (320px to 4K)
- **Touch Interface**: Intuitive touch-friendly interactions
- **Adaptive Navigation**: Mobile-optimized navigation patterns
- **Performance**: Optimized for mobile networks and devices

## 🛠️ Development

### 📋 Code Quality Standards
- **ESLint Configuration**: Comprehensive frontend linting
- **TypeScript Ready**: Type-safe development structure
- **Consistent Formatting**: Automated code formatting
- **Professional Documentation**: Comprehensive inline comments
- **Error Handling**: Robust error management throughout

### 🧪 Testing Strategy
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and database testing
- **E2E Tests**: Complete user journey testing
- **Security Tests**: Authentication and authorization testing
- **Performance Tests**: Load and stress testing

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper documentation
4. **Add tests** for new functionality
5. **Run tests**: `npm test` and `python manage.py test`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### 📝 Development Guidelines
- Follow existing code style and patterns
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure mobile responsiveness
- Test with both English and Arabic languages

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Community

### 📞 Getting Help
- **GitHub Issues**: [Report bugs or request features](https://github.com/SeifAmged/Shipay/issues)
- **Documentation**: Check this README and [DEPLOYMENT.md](DEPLOYMENT.md)
- **Discussions**: Use GitHub Discussions for questions

### 🌟 Show Your Support
- ⭐ **Star this repository** if you find it helpful
- 🍴 **Fork the project** to contribute
- 📢 **Share with others** who might benefit
- 🐛 **Report bugs** to help improve the project

## 🚀 Roadmap

### Upcoming Features
- [ ] **Real-time Notifications**: WebSocket integration for live updates
- [ ] **Advanced Analytics**: Transaction insights and spending patterns
- [ ] **Multi-currency Support**: Support for multiple currencies
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **API Rate Limiting**: Advanced API usage controls
- [ ] **Admin Dashboard**: Enhanced administrative interface

### Performance Improvements
- [ ] **Database Optimization**: Query optimization and indexing
- [ ] **Caching Strategy**: Advanced Redis caching implementation
- [ ] **CDN Integration**: Global content delivery network
- [ ] **Load Balancing**: Horizontal scaling capabilities

---

<div align="center">

**Built with ❤️ by the Shipay Development Team**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/SeifAmged/Shipay)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://github.com/SeifAmged/Shipay)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Professional fintech solutions for the modern world*

</div>
