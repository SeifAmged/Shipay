from pathlib import Path
from datetime import timedelta  # أضف ده عشان timedelta لو عايز تغير COOLOFF لدقايق

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-p(!59e7hh4(hnk(8twju%=^gid1h6a)kl5828)jdfzrjhd@m_^y'
DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'corsheaders',
    'django_filters',
    'axes',    # يبقى هنا
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'axes.middleware.AxesMiddleware',  # مهم: middleware
]

ROOT_URLCONF = 'shipay_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'shipay_project.wsgi.application'


# ✅ Authentication Backends (axes + default)
AUTHENTICATION_BACKENDS = [
    'axes.backends.AxesBackend',  # مهم جدًا
    'django.contrib.auth.backends.ModelBackend',
]


# ✅ Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'shipay_db',
        'USER': 'shipay_user',
        'PASSWORD': '2468',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ✅ Django REST Framework + Custom Exception
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',),
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated'],
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'EXCEPTION_HANDLER': 'api.exceptions.custom_exception_handler',
}


# ✅ CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]


# ✅ Axes Config (جديد: أزلت الdeprecated واستبدلتهم بالجديد عشان الwarnings تختفي)
AXES_FAILURE_LIMIT = 3
AXES_COOLOFF_TIME = timedelta(hours=1)  # غيرتها لـ timedelta عشان تكون واضحة، ممكن تغير لـ minutes=5 للاختبار
AXES_ENABLED = True
AXES_LOCKOUT_PARAMETERS = [['username', 'ip_address']]  # ده يستبدل الـ COMBINATION و ONLY_USER
AXES_LOCKOUT_CALLABLE = 'api.views.axes_lockout_response'