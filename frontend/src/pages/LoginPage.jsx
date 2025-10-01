import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { validateForm, validationRules } from '../utils/validation';

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Clear field-specific error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrors({});
        
        // Client-side validation
        const validation = validateForm(formData, validationRules.login);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);

        try {
            await login(formData.username, formData.password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error details:', err.response ? err.response : err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="form-container"
        >
            <h2>{t('loginToAccount')}</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder={t('username')}
                    value={formData.username}
                    onChange={handleChange}
                    className={errors.username ? 'error' : ''}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
                
                <input
                    type="password"
                    name="password"
                    placeholder={t('password')}
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                />
                {errors.password && <p className="error-message">{errors.password}</p>}

                {error && <p className="error-message">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? t('loggingIn') : t('loginButton')}
                </button>
            </form>

            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                {t('dontHaveAccount')} <Link to="/register">{t('registerHere')}</Link>
            </p>
        </div>
    );
}