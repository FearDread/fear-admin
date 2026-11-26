import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectCurrentUser,
    selectUserLoading,
    selectUserError,
    fetchCurrentUser,
    saveUserPreferences,
    unlinkGoogleAccount,
    clearError,
} from '../../../features/user/slice';

const LANGUAGES = [
    ['en', 'English'],
    ['es', 'Español'],
    ['fr', 'Français'],
    ['de', 'Deutsch'],
    ['pt', 'Português'],
    ['ja', '日本語'],
];

const THEMES = [
    ['auto', 'Match my device'],
    ['light', 'Light'],
    ['dark', 'Dark'],
];

const NOTIFICATION_CHANNELS = [
    ['email', 'Email', 'Order updates, account activity and announcements'],
    ['push', 'Push', 'Alerts in the browser or app'],
    ['sms', 'Text message', 'Sent to the mobile number on your profile'],
];

const FALLBACK_TIMEZONES = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Australia/Sydney',
];

const DEFAULTS = {
    language: 'en',
    timezone: 'UTC',
    theme: 'auto',
    notifications: { email: true, push: true, sms: false },
};

const prefsFromUser = (user) => {
    const p = user?.preferences || {};
    return {
        language: p.language || DEFAULTS.language,
        timezone: p.timezone || DEFAULTS.timezone,
        theme: p.theme || DEFAULTS.theme,
        notifications: { ...DEFAULTS.notifications, ...(p.notifications || {}) },
    };
};

const sameSettings = (a, b) =>
    a.language === b.language &&
    a.timezone === b.timezone &&
    a.theme === b.theme &&
    Object.keys(DEFAULTS.notifications).every((k) => a.notifications[k] === b.notifications[k]);

const SettingsPage = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const loading = useSelector(selectUserLoading);
    const error = useSelector(selectUserError);

    const [settings, setSettings] = useState(DEFAULTS);
    const [notice, setNotice] = useState(null); // { type, text }

    const timezones = useMemo(() => {
        try {
            const zones = Intl.supportedValuesOf('timeZone');
            return zones.includes('UTC') ? zones : ['UTC', ...zones];
        } catch {
            return FALLBACK_TIMEZONES;
        }
    }, []);

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    useEffect(() => {
        if (currentUser) setSettings(prefsFromUser(currentUser));
    }, [currentUser]);

    const saved = useMemo(() => prefsFromUser(currentUser), [currentUser]);
    const dirty = !sameSettings(settings, saved);
    const googleLinked = !!currentUser?.oauth?.google?.id;

    const setField = (name, value) => setSettings((prev) => ({ ...prev, [name]: value }));

    const setChannel = (channel, value) =>
        setSettings((prev) => ({ ...prev, notifications: { ...prev.notifications, [channel]: value } }));

    const handleSave = async (e) => {
        e.preventDefault();
        setNotice(null);
        dispatch(clearError());

        const result = await dispatch(saveUserPreferences(settings));
        if (result.success) setNotice({ type: 'success', text: 'Settings saved.' });
        // failures land in the store's error and render in the alert below
    };

    const handleReset = () => {
        setSettings(saved);
        setNotice(null);
    };

    const handleUnlinkGoogle = async () => {
        if (!window.confirm('Disconnect Google from this account? You will sign in with your email and password instead.')) return;

        setNotice(null);
        const result = await dispatch(unlinkGoogleAccount());
        setNotice(
            result.success
                ? { type: 'success', text: 'Google disconnected.' }
                : { type: 'danger', text: result.error }
        );
    };

    if (!currentUser) {
        return (
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-12">
                        {error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <p className="text-muted">{loading ? 'Loading your settings…' : 'Sign in to manage your settings.'}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {error && (
                <div className="alert alert-danger alert-dismissible mt-3" role="alert">
                    <button type="button" className="close" aria-label="Dismiss" onClick={() => dispatch(clearError())}>
                        &times;
                    </button>
                    <div className="alert-message">
                        <span>
                            <strong>Error:</strong> {error}
                        </span>
                    </div>
                </div>
            )}

            {notice && (
                <div className={`alert alert-${notice.type} alert-dismissible mt-3`} role="alert">
                    <button type="button" className="close" aria-label="Dismiss" onClick={() => setNotice(null)}>
                        &times;
                    </button>
                    <div className="alert-message">
                        <span>{notice.text}</span>
                    </div>
                </div>
            )}

            <div className="row mt-3">
                <div className="col-lg-8">
                    <form onSubmit={handleSave}>
                        {/* General */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">General</h5>

                                <div className="form-group row">
                                    <label className="col-lg-3 col-form-label form-control-label" htmlFor="language">
                                        Language
                                    </label>
                                    <div className="col-lg-9">
                                        <select id="language" className="form-control" value={settings.language}
                                            onChange={(e) => setField('language', e.target.value)} disabled={loading}>
                                            {LANGUAGES.map(([code, label]) => (
                                                <option key={code} value={code}>{label}</option>
                                            ))}
                                            {!LANGUAGES.some(([code]) => code === settings.language) && (
                                                <option value={settings.language}>{settings.language}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-lg-3 col-form-label form-control-label" htmlFor="timezone">
                                        Time zone
                                    </label>
                                    <div className="col-lg-9">
                                        <select id="timezone" className="form-control" value={settings.timezone}
                                            onChange={(e) => setField('timezone', e.target.value)} disabled={loading}>
                                            {timezones.map((tz) => (
                                                <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                                            ))}
                                            {!timezones.includes(settings.timezone) && (
                                                <option value={settings.timezone}>{settings.timezone}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group row mb-0">
                                    <label className="col-lg-3 col-form-label form-control-label" htmlFor="theme">
                                        Theme
                                    </label>
                                    <div className="col-lg-9">
                                        <select id="theme" className="form-control" value={settings.theme}
                                            onChange={(e) => setField('theme', e.target.value)} disabled={loading}>
                                            {THEMES.map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">Notifications</h5>
                                <p className="text-muted">Choose how we reach you.</p>

                                {NOTIFICATION_CHANNELS.map(([channel, label, help], i) => (
                                    <div className={`custom-control custom-switch ${i < NOTIFICATION_CHANNELS.length - 1 ? 'mb-3' : ''}`} key={channel}>
                                        <input type="checkbox" className="custom-control-input" id={`notify-${channel}`}
                                            checked={!!settings.notifications[channel]}
                                            onChange={(e) => setChannel(channel, e.target.checked)} disabled={loading} />
                                        <label className="custom-control-label" htmlFor={`notify-${channel}`}>
                                            {label}
                                            <small className="d-block text-muted">{help}</small>
                                        </label>
                                    </div>
                                ))}

                                {settings.notifications.sms && !currentUser.mobile && (
                                    <div className="alert alert-warning mt-3 mb-0" role="alert">
                                        Text messages need a mobile number. Add one on your profile.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={loading || !dirty}>
                                Discard changes
                            </button>
                            <button type="submit" className="btn btn-primary ml-2" disabled={loading || !dirty}>
                                {loading ? 'Saving…' : 'Save settings'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Account */}
                <div className="col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Account</h5>
                            <p className="mb-1">{currentUser.email}</p>
                            <p className="mb-3">
                                {currentUser.emailVerified ? (
                                    <span className="badge badge-success">Email verified</span>
                                ) : (
                                    <span className="badge badge-warning">Email not verified</span>
                                )}
                            </p>
                            <p className="text-muted mb-0">
                                Update your name, photo and password on your profile.
                            </p>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Connected accounts</h5>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <i className="fa fa-google mr-2"></i>
                                    Google
                                    {googleLinked && currentUser.oauth.google.email && (
                                        <small className="d-block text-muted">{currentUser.oauth.google.email}</small>
                                    )}
                                </div>
                                {googleLinked ? (
                                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={handleUnlinkGoogle} disabled={loading}>
                                        Disconnect
                                    </button>
                                ) : (
                                    <span className="badge badge-secondary">Not connected</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;