import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import authService from '../services/authService';
import { validateForm, validationRules } from '../utils/validation';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [errors, setErrors] = useState({});
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
        setErrors({});
        
        // Client-side validation
        const validation = validateForm(formData, validationRules.register);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setLoading(true);
        try {
            await authService.register(
                formData.username, formData.email, formData.password,
                formData.first_name, formData.last_name
            );
            await login(formData.username, formData.password);
            navigate('/dashboard');
        } catch (err) {
            const apiError = err.response?.data?.detail || 
                             (err.response?.data?.username ? `Username: ${err.response.data.username[0]}` : 'Registration failed.');
            setErrors({ api: apiError });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="form-container"
        >
            <h2>{t('createAccount')}</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    name="first_name" 
                    type="text" 
                    placeholder={t('firstName')} 
                    value={formData.first_name}
                    onChange={handleChange}
                    className={errors.first_name ? 'error' : ''}
                />
                {errors.first_name && <p className="error-message">{errors.first_name}</p>}
                
                <input 
                    name="last_name" 
                    type="text" 
                    placeholder={t('lastName')} 
                    value={formData.last_name}
                    onChange={handleChange}
                    className={errors.last_name ? 'error' : ''}
                />
                {errors.last_name && <p className="error-message">{errors.last_name}</p>}
                
                <input 
                    name="username" 
                    type="text" 
                    placeholder={t('username')} 
                    value={formData.username}
                    onChange={handleChange}
                    className={errors.username ? 'error' : ''}
                />
                {errors.username && <p className="error-message">{errors.username}</p>}
                
                <input 
                    name="email" 
                    type="email" 
                    placeholder={t('email')} 
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
                
                <input 
                    name="password" 
                    type="password" 
                    placeholder={t('password')} 
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
                
                {errors.api && <p className="error-message">{errors.api}</p>}
                
                <button 
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : t('registerButton')}
                </button>
            </form>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                {t('alreadyHaveAccount')} <Link to="/login">{t('loginHere')}</Link>
            </p>
        </div>
    );
}