import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    selectCurrentUser, selectUserLoading, selectUserError, selectUserSuccess,
    updateUserProfileWithStorage, changePassword, logoutUser, clearError, setSuccess,
} from '../../features/user/slice';
import AccountSidebar from './components/AccountSidebar';
import { T, userStyles } from "./styles";

export const UserDetails = () => {
    const dispatch   = useDispatch();
    const navigate   = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const loading     = useSelector(selectUserLoading);
    const error       = useSelector(selectUserError);
    const success     = useSelector(selectUserSuccess);

    const [formData, setFormData]           = useState({ firstName:'', lastName:'', displayName:'', email:'' });
    const [passwordData, setPasswordData]   = useState({ currentPassword:'', newPassword:'', confirmPassword:'' });
    const [showPw, setShowPw]               = useState({ current:false, new:false, confirm:false });
    const [valErrors, setValErrors]         = useState({});
    const [editingPw, setEditingPw]         = useState(false);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                firstName:   currentUser.firstName?.trim() || '',
                lastName:    currentUser.lastName?.trim()  || '',
                displayName: currentUser.displayName || `${currentUser.firstName||''} ${currentUser.lastName||''}`.trim(),
                email:       currentUser.email || '',
            });
        }
    }, [currentUser]);

    useEffect(() => {
        if (success) {
            const t = setTimeout(() => dispatch(setSuccess(false)), 3000);
            return () => clearTimeout(t);
        }
    }, [success, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        if (valErrors[name]) setValErrors(p => ({ ...p, [name]: '' }));
    };
    const handlePwChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(p => ({ ...p, [name]: value }));
        if (valErrors[name]) setValErrors(p => ({ ...p, [name]: '' }));
    };
    const togglePw = (f) => setShowPw(p => ({ ...p, [f]: !p[f] }));

    const validateProfile = () => {
        const e = {};
        if (!formData.firstName.trim()) e.firstName = 'First name is required';
        if (!formData.lastName.trim())  e.lastName  = 'Last name is required';
        if (!formData.email.trim())     e.email     = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Email is invalid';
        setValErrors(e); return Object.keys(e).length === 0;
    };
    const validatePassword = () => {
        const e = {};
        if (!passwordData.currentPassword) e.currentPassword = 'Current password is required';
        if (!passwordData.newPassword)     e.newPassword = 'New password is required';
        else if (passwordData.newPassword.length < 8) e.newPassword = 'Minimum 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword))
            e.newPassword = 'Must contain uppercase, lowercase and number';
        if (!passwordData.confirmPassword) e.confirmPassword = 'Please confirm your new password';
        else if (passwordData.newPassword !== passwordData.confirmPassword) e.confirmPassword = 'Passwords do not match';
        if (passwordData.currentPassword === passwordData.newPassword)
            e.newPassword = 'New password must be different from current';
        setValErrors(e); return Object.keys(e).length === 0;
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        if (!validateProfile()) return;
        const result = await dispatch(updateUserProfileWithStorage({
            firstName: formData.firstName, lastName: formData.lastName,
            displayName: formData.displayName, email: formData.email,
        }));
        if (result.success) { dispatch(setSuccess(true)); window.scrollTo({ top:0, behavior:'smooth' }); }
    };
    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;
        const result = await dispatch(changePassword({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }));
        if (changePassword.fulfilled.match(result)) {
            setPasswordData({ currentPassword:'', newPassword:'', confirmPassword:'' });
            setEditingPw(false); dispatch(setSuccess(true)); window.scrollTo({ top:0, behavior:'smooth' });
        }
    };
    const cancelPwEdit = () => {
        setEditingPw(false);
        setPasswordData({ currentPassword:'', newPassword:'', confirmPassword:'' });
        setValErrors({});
    };

    if (!currentUser) return (
        <><style>{userStyles}</style>
        <div className="ud-loading">
            <div className="ud-loading-spinner"/>
            <span className="ud-loading-label">Loading account…</span>
        </div></>
    );

    return (
        <>
            <style>{userStyles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet"/>
            <div className="ud-page">

                {/* HERO */}
                <section className="ud-hero">
                    <div className="ud-hero-stripe"/>
                    <div className="ud-hero-ghost" aria-hidden>PROFILE</div>
                    <div className="ud-hero-inner">
                        <div className="ud-breadcrumb">
                            <Link to="/" className="ud-bc-link">Home</Link>
                            <span className="ud-bc-sep">✦</span>
                            <Link to="/account/dashboard" className="ud-bc-link">Account</Link>
                            <span className="ud-bc-sep">✦</span>
                            <span className="ud-bc-current">Account Details</span>
                        </div>
                        <span className="ud-eyebrow">My Account</span>
                        <h1 className="ud-hero-title">Account <span>Details</span></h1>
                    </div>
                </section>

                {/* LAYOUT */}
                <div className="ud-layout">
                    <AccountSidebar currentUser={currentUser}/>

                    <main>
                        {success && (
                            <div className="ud-toast success">
                                <span className="ud-toast-icon">✓</span>
                                <span style={{flex:1}}>Changes saved successfully!</span>
                                <button className="ud-toast-close" onClick={() => dispatch(setSuccess(false))}>✕</button>
                            </div>
                        )}
                        {error && (
                            <div className="ud-toast error">
                                <span className="ud-toast-icon">⚠</span>
                                <span style={{flex:1}}>{error}</span>
                                <button className="ud-toast-close" onClick={() => dispatch(clearError())}>✕</button>
                            </div>
                        )}

                        {/* PROFILE PANEL */}
                        <div className="ud-panel" style={{'--pa': T.orange}}>
                            <div className="ud-panel-head">
                                <h2 className="ud-panel-title">Profile Information</h2>
                            </div>
                            <div className="ud-panel-body">
                                <form onSubmit={handleSubmitProfile} noValidate>
                                    <div className="ud-field-row">
                                        <div>
                                            <label className="ud-label">First Name <span className="ud-label-req">*</span></label>
                                            <input type="text" name="firstName" autoComplete="given-name" placeholder="John"
                                                className={`ud-input${valErrors.firstName?' err':''}`}
                                                value={formData.firstName} onChange={handleChange} disabled={loading}/>
                                            {valErrors.firstName && <div className="ud-field-err">{valErrors.firstName}</div>}
                                        </div>
                                        <div>
                                            <label className="ud-label">Last Name <span className="ud-label-req">*</span></label>
                                            <input type="text" name="lastName" autoComplete="family-name" placeholder="Doe"
                                                className={`ud-input${valErrors.lastName?' err':''}`}
                                                value={formData.lastName} onChange={handleChange} disabled={loading}/>
                                            {valErrors.lastName && <div className="ud-field-err">{valErrors.lastName}</div>}
                                        </div>
                                    </div>
                                    <div className="ud-field">
                                        <label className="ud-label">Display Name</label>
                                        <input type="text" name="displayName" autoComplete="nickname"
                                            placeholder="How your name will be displayed"
                                            className="ud-input" value={formData.displayName}
                                            onChange={handleChange} disabled={loading}/>
                                        <p className="ud-field-hint">Appears on reviews and orders.</p>
                                    </div>
                                    <div className="ud-field">
                                        <label className="ud-label">Email Address <span className="ud-label-req">*</span></label>
                                        <input type="email" name="email" autoComplete="email"
                                            className={`ud-input${valErrors.email?' err':''}`}
                                            value={formData.email} onChange={handleChange} disabled={loading}/>
                                        {valErrors.email && <div className="ud-field-err">{valErrors.email}</div>}
                                    </div>
                                    <div style={{paddingTop:'.5rem'}}>
                                        <button type="submit" className="ud-btn-primary" disabled={loading}>
                                            {loading ? <><div className="ud-spinner"/> Saving…</> : <>✓&nbsp; Save Profile Changes</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* PASSWORD PANEL */}
                        <div className="ud-panel" style={{'--pa': T.red}}>
                            <div className="ud-panel-head">
                                <h2 className="ud-panel-title">Password</h2>
                                {!editingPw && (
                                    <button type="button" className="ud-btn-outline" style={{'--pa': T.red}}
                                        onClick={() => setEditingPw(true)}>
                                        🔑 Change Password
                                    </button>
                                )}
                            </div>
                            <div className="ud-panel-body">
                                {editingPw ? (
                                    <form onSubmit={handleSubmitPassword} noValidate>
                                        {[
                                            { key:'currentPassword', label:'Current Password', auto:'current-password' },
                                            { key:'newPassword',     label:'New Password',     auto:'new-password',
                                              hint:'Min 8 characters with uppercase, lowercase and numbers.' },
                                            { key:'confirmPassword', label:'Confirm New Password', auto:'new-password' },
                                        ].map(({ key, label, auto, hint }) => {
                                            const fieldKey = key === 'currentPassword' ? 'current' : key === 'newPassword' ? 'new' : 'confirm';
                                            return (
                                                <div className="ud-field" key={key}>
                                                    <label className="ud-label" style={{'--pa': T.red}}>
                                                        {label} <span className="ud-label-req">*</span>
                                                    </label>
                                                    <div className="ud-pw-wrap">
                                                        <input
                                                            type={showPw[fieldKey] ? 'text' : 'password'}
                                                            name={key} autoComplete={auto}
                                                            className={`ud-input${valErrors[key]?' err':''}`}
                                                            value={passwordData[key]}
                                                            onChange={handlePwChange} disabled={loading}
                                                            placeholder={`Enter ${label.toLowerCase()}`}
                                                        />
                                                        <button type="button" className="ud-pw-toggle" onClick={() => togglePw(fieldKey)}>
                                                            {showPw[fieldKey] ? '🙈' : '👁'}
                                                        </button>
                                                    </div>
                                                    {valErrors[key] && <div className="ud-field-err">{valErrors[key]}</div>}
                                                    {hint && <p className="ud-field-hint">{hint}</p>}
                                                </div>
                                            );
                                        })}
                                        <div style={{display:'flex', gap:'.75rem', paddingTop:'.5rem', flexWrap:'wrap'}}>
                                            <button type="submit" className="ud-btn-primary" disabled={loading} style={{'--pa': T.red}}>
                                                {loading ? <><div className="ud-spinner"/> Updating…</> : <>🔑&nbsp; Update Password</>}
                                            </button>
                                            <button type="button" className="ud-btn-ghost" onClick={cancelPwEdit} disabled={loading}>
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="ud-pw-locked">
                                        <span className="ud-pw-locked-icon">🔒</span>
                                        <p className="ud-pw-locked-text">
                                            Your password is encrypted and secure. Click "Change Password" above to update it.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </main>
                </div>

                <div className="ud-animated-border"/>
            </div>
        </>
    );
};

export default UserDetails;