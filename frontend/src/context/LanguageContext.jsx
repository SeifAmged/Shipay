/**
 * Language context for managing internationalization (i18n) state.
 * 
 * Provides language switching functionality with:
 * - Persistent language preference in localStorage
 * - Bilingual support (English/Arabic)
 * - Translation function for text content
 * - Automatic language persistence across sessions
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

/**
 * Language provider component.
 * 
 * Manages global language state and provides translation
 * functionality to child components through React context.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('shipay-language') || 'en';
  });

  // Persist language preference to localStorage
  useEffect(() => {
    localStorage.setItem('shipay-language', language);
  }, [language]);

  /**
   * Toggles between English and Arabic languages.
   */
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const translations = {
    en: {
      // Navigation
      dashboard: 'Dashboard',
      transfer: 'Transfer',
      transactions: 'Transactions',
      depositWithdraw: 'Deposit/Withdraw',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      
      // Homepage
      welcomeTitle: 'Welcome to Shipay — your wallet of the future.',
      promoText: '💸 Start your digital journey with a gift! New users get an instant 1000 EGP welcome bonus — but only for a limited time!',
      claimBonus: '🚀 Claim My Bonus',
      haveAccount: 'I Already Have an Account',
      
      // Dashboard
      welcome: 'Welcome',
      yourBalance: 'Your Balance',
      sendMoney: 'Send Money',
      viewHistory: 'View History',
      recentActivity: 'Recent Activity',
      date: 'Date',
      type: 'Type',
      amount: 'Amount',
      noTransactions: 'No recent transactions.',
      
      // Forms
      username: 'Username',
      password: 'Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      recipientUsername: "Recipient's Username",
      amountEGP: 'Amount (EGP)',
      
      // Actions
      loginButton: 'Login',
      registerButton: 'Register',
      sendMoneyButton: 'Send Money',
      deposit: 'Deposit',
      withdraw: 'Withdraw',
      
      // Footer
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      footerText: '© 2025 Shipay | Designed for Trust. Built for Speed.',
      
      // Messages
      insufficientBalance: '🚫 Insufficient balance for reveal (10 EGP required).',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      
      // Additional Dashboard
      firstRevealsFree: 'First 3 reveals free daily, then 10 EGP each',
      freeRevealsLeft: 'You have {count} free reveals left today.',
      
      // Forms
      loginToAccount: 'Login to Your Account',
      createAccount: 'Create an Account',
      transferFunds: 'Transfer Funds',
      manageFunds: 'Manage Funds',
      transactionHistory: 'Transaction History',
      
      // Form validation
      usernameRequired: 'Username is required.',
      passwordRequired: 'Password is required.',
      firstNameRequired: 'First name is required.',
      lastNameRequired: 'Last name is required.',
      emailInvalid: 'Email is not valid.',
      passwordMinLength: 'Password must be at least 6 characters.',
      
      // Actions
      loggingIn: 'Logging in...',
      transferSuccessful: 'Transfer successful!',
      depositSuccessful: 'Deposit successful!',
      withdrawSuccessful: 'Withdraw successful!',
      
      // Filters
      allTypes: 'All Types',
      from: 'From',
      to: 'To',
      apply: 'Apply',
      previous: 'Previous',
      next: 'Next',
      page: 'Page',
      of: 'of',
      time: 'Time',
      counterparty: 'Counterparty',
      
      // Additional text
      dontHaveAccount: "Don't have an account?",
      registerHere: "Register here",
      alreadyHaveAccount: "Already have an account?",
      loginHere: "Login here"
    },
    ar: {
      // Navigation
      dashboard: 'لوحة التحكم',
      transfer: 'تحويل',
      transactions: 'المعاملات',
      depositWithdraw: 'إيداع/سحب',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      
      // Homepage
      welcomeTitle: 'مرحباً بك في Shipay — محفظتك الرقمية المستقبلية.',
      promoText: '💸 ابدأ رحلتك الرقمية بهدية! المستخدمون الجدد يحصلون على مكافأة ترحيبية فورية بقيمة 1000 جنيه — لفترة محدودة فقط!',
      claimBonus: '🚀 احصل على مكافأتي',
      haveAccount: 'لدي حساب بالفعل',
      
      // Dashboard
      welcome: 'مرحباً',
      yourBalance: 'رصيدك',
      sendMoney: 'إرسال أموال',
      viewHistory: 'عرض السجل',
      recentActivity: 'النشاط الأخير',
      date: 'التاريخ',
      type: 'النوع',
      amount: 'المبلغ',
      noTransactions: 'لا توجد معاملات حديثة.',
      
      // Forms
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      email: 'البريد الإلكتروني',
      recipientUsername: 'اسم المستخدم للمستقبل',
      amountEGP: 'المبلغ (جنيه)',
      
      // Actions
      loginButton: 'تسجيل الدخول',
      registerButton: 'إنشاء حساب',
      sendMoneyButton: 'إرسال أموال',
      deposit: 'إيداع',
      withdraw: 'سحب',
      
      // Footer
      quickLinks: 'روابط سريعة',
      contactUs: 'اتصل بنا',
      footerText: '© 2025 Shipay | مصمم للثقة. مبني للسرعة.',
      
      // Messages
      insufficientBalance: '🚫 رصيد غير كافي للكشف (مطلوب 10 جنيه).',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      
      // Additional Dashboard
      firstRevealsFree: 'أول 3 كشوفات مجانية يومياً، ثم 10 جنيه لكل كشف',
      freeRevealsLeft: 'لديك {count} كشف مجاني متبقي اليوم.',
      
      // Forms
      loginToAccount: 'تسجيل الدخول إلى حسابك',
      createAccount: 'إنشاء حساب',
      transferFunds: 'تحويل الأموال',
      manageFunds: 'إدارة الأموال',
      transactionHistory: 'سجل المعاملات',
      
      // Form validation
      usernameRequired: 'اسم المستخدم مطلوب.',
      passwordRequired: 'كلمة المرور مطلوبة.',
      firstNameRequired: 'الاسم الأول مطلوب.',
      lastNameRequired: 'اسم العائلة مطلوب.',
      emailInvalid: 'البريد الإلكتروني غير صحيح.',
      passwordMinLength: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.',
      
      // Actions
      loggingIn: 'جاري تسجيل الدخول...',
      transferSuccessful: 'تم التحويل بنجاح!',
      depositSuccessful: 'تم الإيداع بنجاح!',
      withdrawSuccessful: 'تم السحب بنجاح!',
      
      // Filters
      allTypes: 'جميع الأنواع',
      from: 'من',
      to: 'إلى',
      apply: 'تطبيق',
      previous: 'السابق',
      next: 'التالي',
      page: 'صفحة',
      of: 'من',
      time: 'الوقت',
      counterparty: 'الطرف المقابل',
      
      // Additional text
      dontHaveAccount: "ليس لديك حساب؟",
      registerHere: "سجل هنا",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      loginHere: "سجل الدخول هنا"
    }
  };

  /**
   * Translation function that returns the appropriate text for the current language.
   * 
   * @param {string} key - Translation key
   * @returns {string} Translated text or key if translation not found
   */
  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to access language context.
 * 
 * @returns {Object} Language context value with translation function
 * @throws {Error} When used outside of LanguageProvider
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
