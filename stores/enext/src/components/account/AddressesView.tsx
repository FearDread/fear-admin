'use client';

import { useMemo, useState, type CSSProperties } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectCurrentUser } from '@/lib/redux/slices/authSlice';
import {
    useGetAddressesQuery,
    useCreateAddressMutation,
    useUpdateAddressMutation,
    useRemoveAddressMutation,
    type Address,
    type AddressInput,
} from '@/lib/redux/api/addressesApi';
import { apiErrorMessage, fullName, userId } from '@/lib/account/helpers';
import { T } from './styles';

type AddressType = 'billing' | 'shipping';
type AddressForm = Omit<Address, 'id'>;
type FormKey = keyof AddressForm;

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'South Africa', 'Other'];

const FIELDS: { name: FormKey; label: string; ph?: string; required?: boolean; full?: boolean; type?: string }[] = [
    { name: 'fullName', label: 'Full Name', ph: 'John Doe', required: true, full: true },
    { name: 'line1', label: 'Address Line 1', ph: '123 Main Street', required: true, full: true },
    { name: 'line2', label: 'Address Line 2', ph: 'Apt 4B', full: true },
    { name: 'city', label: 'City', ph: 'Killeen', required: true },
    { name: 'state', label: 'State / Province', ph: 'TX', required: true },
    { name: 'zipCode', label: 'ZIP / Postal Code', ph: '76541', required: true },
    { name: 'country', label: 'Country', required: true },
    { name: 'phone', label: 'Phone', ph: '(123) 456-7890', type: 'tel', full: true },
];

const emptyAddress = (type: AddressType, fullName = ''): AddressForm => ({
    fullName, line1: '', line2: '', city: '', state: '', zipCode: '',
    country: 'United States', phone: '', type, isDefault: false,
});

// Pure, synchronous field validation — no thunk, no store round trip.
function validate(a: AddressForm) {
    const e: Partial<Record<FormKey, string>> = {};
    if (!a.fullName.trim()) e.fullName = 'Full name is required';
    if (!a.line1.trim()) e.line1 = 'Address line 1 is required';
    if (!a.city.trim()) e.city = 'City is required';
    if (!a.state.trim()) e.state = 'State / province is required';
    if (!a.zipCode.trim()) e.zipCode = 'ZIP / postal code is required';
    if (!a.country.trim()) e.country = 'Country is required';
    if (a.phone && !/^[\d()+\-.\s]{7,}$/.test(a.phone)) e.phone = 'Enter a valid phone number';
    return e;
}

interface PanelProps {
    type: AddressType;
    title: string;
    icon: string;
    accent: string;
    addresses: Address[];
    uid: string;
    defaultName: string;
    /** Shipping panel offers "copy from billing" using the billing default. */
    copyFrom?: Address;
}

// Module scope so form state survives parent re-renders.
function AddressPanel({ type, title, icon, accent, addresses, uid, defaultName, copyFrom }: PanelProps) {
    const [createAddress, { isLoading: creating }] = useCreateAddressMutation();
    const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
    const [removeAddress] = useRemoveAddressMutation();

    const [editingId, setEditingId] = useState<string | 'new' | null>(null);
    const [form, setForm] = useState<AddressForm>(emptyAddress(type, defaultName));
    const [errors, setErrors] = useState<Partial<Record<FormKey, string>>>({});
    const [apiError, setApiError] = useState('');
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const sorted = useMemo(() => [...addresses].sort((a, b) => Number(!!b.isDefault) - Number(!!a.isDefault)), [addresses]);
    const saving = creating || updating;

    const openNew = () => {
        setForm({ ...emptyAddress(type, defaultName), isDefault: addresses.length === 0 });
        setErrors({}); setApiError(''); setEditingId('new');
    };
    const openEdit = (a: Address) => {
        const { id: _id, ...rest } = a;
        setForm({ ...emptyAddress(type), ...rest });
        setErrors({}); setApiError(''); setEditingId(a.id);
    };
    const close = () => { setEditingId(null); setErrors({}); setApiError(''); };

    const setField = (name: FormKey, value: string) => {
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
    };

    const handleSave = async () => {
        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length) return;
        if (!uid) { setApiError('Your session is missing a user id. Please log in again.'); return; }

        setApiError('');
        const payload: AddressInput = { ...form, type, userId: uid };
        try {
            if (editingId === 'new') await createAddress(payload).unwrap();
            else if (editingId) await updateAddress({ id: editingId, updates: payload }).unwrap();
            close();
        } catch (err) {
            setApiError(apiErrorMessage(err, 'Failed to save address. Please try again.'));
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await removeAddress(id).unwrap();
            setConfirmDeleteId(null);
        } catch (err) {
            setApiError(apiErrorMessage(err, 'Failed to delete address.'));
            setConfirmDeleteId(null);
        }
    };

    const makeDefault = async (id: string) => {
        try {
            await updateAddress({ id, updates: { isDefault: true } }).unwrap();
        } catch (err) {
            setApiError(apiErrorMessage(err, 'Failed to set default address.'));
        }
    };

    return (
        <div className="acct-panel" style={{ '--pa': accent } as CSSProperties}>
            <div className="acct-panel-head">
                <h2 className="acct-panel-title"><span aria-hidden="true">{icon}</span> {title}</h2>
                {editingId === null && (
                    <button className="acct-btn acct-btn--sm" onClick={openNew}>+ Add address</button>
                )}
            </div>
            <div className="acct-panel-body">
                {apiError && editingId === null && (
                    <div className="acct-alert error" role="alert"><span>⚠</span><span>{apiError}</span></div>
                )}

                {editingId === null ? (
                    sorted.length === 0 ? (
                        <p className="acct-hint" style={{ margin: 0 }}>No {type} address saved yet.</p>
                    ) : (
                        <div className="acct-addr-grid">
                            {sorted.map((a) => (
                                <div key={a.id} className={`acct-addr${a.isDefault ? ' default' : ''}`}>
                                    <address className="acct-address">
                                        <strong>{a.fullName}</strong><br />
                                        {a.line1}{a.line2 ? <>, {a.line2}</> : null}<br />
                                        {a.city}, {a.state} {a.zipCode}<br />
                                        {a.country}
                                        {a.phone ? <><br />{a.phone}</> : null}
                                    </address>
                                    {a.isDefault && <span className="acct-badge" style={{ alignSelf: 'flex-start' }}>Default</span>}
                                    <div className="acct-addr-actions">
                                        {confirmDeleteId === a.id ? (
                                            <>
                                                <button className="acct-btn acct-btn--danger acct-btn--sm" onClick={() => handleDelete(a.id)}>Confirm delete</button>
                                                <button className="acct-btn acct-btn--ghost acct-btn--sm" onClick={() => setConfirmDeleteId(null)}>Keep</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="acct-btn acct-btn--ghost acct-btn--sm" onClick={() => openEdit(a)}>Edit</button>
                                                {!a.isDefault && (
                                                    <button className="acct-btn acct-btn--ghost acct-btn--sm" onClick={() => makeDefault(a.id)}>Make default</button>
                                                )}
                                                <button className="acct-btn acct-btn--danger acct-btn--sm" onClick={() => setConfirmDeleteId(a.id)}>Delete</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <>
                        {copyFrom && editingId === 'new' && (
                            <button
                                type="button"
                                className="acct-btn acct-btn--ghost acct-btn--sm"
                                style={{ marginBottom: '1.1rem' }}
                                onClick={() => {
                                    const { id: _id, ...rest } = copyFrom;
                                    setForm({ ...emptyAddress(type), ...rest, type, isDefault: addresses.length === 0 });
                                }}
                            >
                                Copy from billing address
                            </button>
                        )}
                        <div className="acct-field-row" style={{ marginBottom: '.25rem' }}>
                            {FIELDS.map((f) => (
                                <div key={f.name} className={`acct-field${f.full ? ' acct-field--full' : ''}`}>
                                    <label className="acct-label" htmlFor={`${type}-${f.name}`}>
                                        {f.label}{f.required && <em>*</em>}
                                    </label>
                                    {f.name === 'country' ? (
                                        <select
                                            id={`${type}-country`}
                                            className={`acct-select${errors.country ? ' err' : ''}`}
                                            value={form.country}
                                            onChange={(e) => setField('country', e.target.value)}
                                        >
                                            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            id={`${type}-${f.name}`}
                                            type={f.type ?? 'text'}
                                            className={`acct-input${errors[f.name] ? ' err' : ''}`}
                                            placeholder={f.ph}
                                            value={(form[f.name] as string) ?? ''}
                                            onChange={(e) => setField(f.name, e.target.value)}
                                            disabled={saving}
                                        />
                                    )}
                                    {errors[f.name] && <div className="acct-err">{errors[f.name]}</div>}
                                </div>
                            ))}
                        </div>
                        {apiError && <div className="acct-alert error" role="alert"><span>⚠</span><span>{apiError}</span></div>}
                        <div className="acct-form-actions">
                            <button className="acct-btn" onClick={handleSave} disabled={saving}>
                                {saving ? (<><span className="acct-spinner" /> Saving…</>) : 'Save address'}
                            </button>
                            <button className="acct-btn acct-btn--ghost" onClick={close} disabled={saving}>Cancel</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function AddressesView() {
    const currentUser = useAppSelector(selectCurrentUser);
    const { data, isLoading, isError, refetch } = useGetAddressesQuery();

    const billing = useMemo(() => (data ?? []).filter((a) => a.type === 'billing'), [data]);
    const shipping = useMemo(() => (data ?? []).filter((a) => a.type === 'shipping'), [data]);
    const billingDefault = billing.find((a) => a.isDefault) ?? billing[0];

    if (isLoading) return <><div className="acct-skel" /><div className="acct-skel" /></>;

    if (isError) {
        return (
            <div className="acct-empty">
                <span className="acct-empty-icon" aria-hidden="true">⚠</span>
                <h3>Couldn&apos;t load addresses</h3>
                <p>Something went wrong fetching your saved addresses.</p>
                <button className="acct-btn" onClick={() => refetch()}>Try again</button>
            </div>
        );
    }

    const uid = userId(currentUser);
    const name = fullName(currentUser);

    return (
        <>
            <div className="acct-alert info">
                <span>ℹ</span>
                <span>Your default addresses are pre-filled at checkout.</span>
            </div>
            <AddressPanel type="shipping" title="Shipping Addresses" icon="📦" accent={T.teal} addresses={shipping} uid={uid} defaultName={name} copyFrom={billingDefault} />
            <AddressPanel type="billing" title="Billing Addresses" icon="🧾" accent={T.red} addresses={billing} uid={uid} defaultName={name} />
        </>
    );
}