# Shipay Deployment Guide

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend development)

## Backend Deployment

### Using Docker (Recommended)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file with your production settings:
   ```env
   SECRET_KEY=your-super-secret-key-here
   DB_NAME=shipay_db
   DB_USER=shipay_user
   DB_PASSWORD=your-secure-password
   DB_HOST=db
   DB_PORT=5432
   REDIS_URL=redis://redis:6379/1
   FRONTEND_URL=https://yourdomain.com
   ALLOWED_HOST=yourdomain.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

3. Run the application:
   ```bash
   docker-compose up -d
   ```

4. Run migrations:
   ```bash
   docker-compose exec web python manage.py migrate --settings=shipay_project.settings_production
   ```

5. Create a superuser:
   ```bash
   docker-compose exec web python manage.py createsuperuser --settings=shipay_project.settings_production
   ```

### Manual Deployment

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set environment variables (same as above)

3. Run migrations:
   ```bash
   python manage.py migrate --settings=shipay_project.settings_production
   ```

4. Collect static files:
   ```bash
   python manage.py collectstatic --settings=shipay_project.settings_production
   ```

5. Run with Gunicorn:
   ```bash
   gunicorn --bind 0.0.0.0:8000 shipay_project.wsgi:application
   ```

## Frontend Deployment

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Serve the built files using a web server like Nginx or Apache, or deploy to platforms like:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

## Environment Variables

### Backend (.env)
- `SECRET_KEY`: Django secret key
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `REDIS_URL`: Redis connection URL
- `FRONTEND_URL`: Frontend application URL
- `ALLOWED_HOST`: Allowed host for Django
- `EMAIL_HOST`: SMTP host for emails
- `EMAIL_PORT`: SMTP port
- `EMAIL_USE_TLS`: Use TLS for email
- `EMAIL_HOST_USER`: Email username
- `EMAIL_HOST_PASSWORD`: Email password

### Frontend
Update the API base URL in `frontend/src/services/http.js` to point to your backend URL.

## Security Considerations

1. **Change default passwords** in production
2. **Use HTTPS** in production
3. **Set up proper CORS** origins
4. **Configure firewall** rules
5. **Regular security updates**
6. **Monitor logs** for suspicious activity
7. **Backup database** regularly

## Monitoring

- Set up logging to monitor errors
- Use tools like Sentry for error tracking
- Monitor database performance
- Set up health checks

## Scaling

- Use a load balancer for multiple backend instances
- Set up database replication
- Use Redis for session storage and caching
- Consider using CDN for static files
