'use client';

/**
 * AddressesView.tsx
 *
 * Converted from Addresses.jsx (AccountAddresses). Notable changes:
 *
 *   - `fetchAddresses` / `createAddress` / `updateAddress` / `removeAddress`
 *     thunks → `addressesApi` (RTK Query), matching the pattern used
 *     everywhere else.
 *   - BUG FIX: the original `handleSaveAddress` dispatched a `validateAddress`
 *     thunk, then `await new Promise(resolve => setTimeout(resolve, 100))`,
 *     then read back Redux validation state hoping the thunk had resolved in
 *     that 100ms window — a real race condition, and the read-back selector
 *     call (`selectAddressValidation({ address: { validation } })`) was
 *     circular (it re-wrapped a value already pulled from state via the same
 *     selector). Address validation is pure client-side field checking, so
 *     `validateAddressFields()` below runs synchronously before the mutation
 *     fires — no thunk, no store round trip, no race.
 *   - The auth-redirect `useEffect` is gone — handled once in
 *     `AccountClient.tsx`.
 *   - `useEffect` that auto-populated the form from `allAddresses` (with
 *     `allAddresses` itself as a dependency, right after dispatching the
 *     fetch that populates it — a classic "read what I just started fetching"
 *     timing bug) is replaced with a `useEffect` keyed off the *query result*
 *     from `useGetAddressesQuery`, which is always up to date once the
 *     request resolves.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    useGetAddressesQuery,
    useCreateAddressMutation,
    useUpdateAddressMutation,
    useRemoveAddressMutation,
    type Address,
    type AddressInput,
} from '@/features/api/addressesApi';
import { useCurrentUser } from '@/features/api/authApi';
import AccountSidebar from './AccountSidebar';
import { addressStyles } from '../styles';

type AddressType = 'billing' | 'shipping';
type AddressForm = Omit<Address, 'id'>;

const emptyAddress = (type: AddressType): AddressForm => ({
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    type,
    isDefault: false,
});

function validateAddressFields(address: AddressForm) {
    const errors: Record<string, string> = {};
    if (!address.fullName.trim()) errors.fullName = 'Full name is required';
    if (!address.line1.trim()) errors.line1 = 'Address line 1 is required';
    if (!address.city.trim()) errors.city = 'City is required';
    if (!address.state.trim()) errors.state = 'State/Province is required';
    if (!address.zipCode.trim()) errors.zipCode = 'ZIP/Postal code is required';
    if (!address.country.trim()) errors.country = 'Country is required';
    if (address.phone && !/^[\d()+\-.\s]{7,}$/.test(address.phone)) errors.phone = 'Enter a valid phone number';
    return errors;
}

export function AddressesView() {
    const { currentUser, isAuthenticated, loading: userLoading } = useCurrentUser();
    const userFullName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '';

    const { data: allAddresses = [], isLoading: addressesLoading, error: userError } = useGetAddressesQuery(undefined, {
        skip: !isAuthenticated,
    });
    const [createAddress] = useCreateAddressMutation();
    const [updateAddress] = useUpdateAddressMutation();
    const [removeAddress] = useRemoveAddressMutation();

    const billingAddresses = allAddresses.filter((a) => a.type === 'billing');
    const shippingAddresses = allAddresses.filter((a) => a.type === 'shipping');

    const [editMode, setEditMode] = useState({ billing: false, shipping: false });
    const [editingAddressId, setEditingAddressId] = useState<{ billing: string | null; shipping: string | null }>({
        billing: null,
        shipping: null,
    });
    const [formData, setFormData] = useState<{ billing: AddressForm; shipping: AddressForm }>({
        billing: emptyAddress('billing'),
        shipping: emptyAddress('shipping'),
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [sameAsBilling, setSameAsBilling] = useState(false);
    const [saving, setSaving] = useState(false);

    // Populate the display forms once addresses have actually loaded — keyed
    // off the query result, not off a fetch dispatched in the same effect.
    useEffect(() => {
        if (!allAddresses.length) return;

        const primaryBilling = billingAddresses.find((a) => a.isDefault) || billingAddresses[0];
        const primaryShipping = shippingAddresses.find((a) => a.isDefault) || shippingAddresses[0];

        if (primaryBilling) {
            setFormData((prev) => ({ ...prev, billing: { ...primaryBilling } }));
            setEditingAddressId((prev) => ({ ...prev, billing: primaryBilling.id }));
        }
        if (primaryShipping) {
            setFormData((prev) => ({ ...prev, shipping: { ...primaryShipping } }));
            setEditingAddressId((prev) => ({ ...prev, shipping: primaryShipping.id }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allAddresses]);

    const handleInputChange = (type: AddressType, field: keyof AddressForm, value: string) => {
        setFormData((prev) => ({ ...prev, [type]: { ...prev[type], [field]: value } }));
    };

    const handleSameAsBillingChange = (checked: boolean) => {
        setSameAsBilling(checked);
        if (checked) {
            setFormData((prev) => ({ ...prev, shipping: { ...prev.billing, type: 'shipping' } }));
        }
    };

    const toggleEditMode = (type: AddressType) => {
        setEditMode((prev) => ({ ...prev, [type]: !prev[type] }));
        if (!editMode[type]) setFieldErrors({});
    };

    const handleSaveAddress = async (type: AddressType) => {
        if (!currentUser) return;
        const address = formData[type];
        const errors = validateAddressFields(address);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSaving(true);
        try {
            const payload: AddressInput = { ...address, type, userId: currentUser._id };
            if (editingAddressId[type]) {
                await updateAddress({ id: editingAddressId[type]!, updates: payload }).unwrap();
            } else {
                const created = await createAddress(payload).unwrap();
                setEditingAddressId((prev) => ({ ...prev, [type]: created.id }));
            }
            setEditMode((prev) => ({ ...prev, [type]: false }));
            setFieldErrors({});
        } catch (err: any) {
            alert(`Failed to save address: ${err?.data?.message || 'Please try again.'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = (type: AddressType) => {
        const addresses = type === 'billing' ? billingAddresses : shippingAddresses;
        const existing = addresses.find((a) => a.id === editingAddressId[type]) || addresses[0];
        setFormData((prev) => ({ ...prev, [type]: existing ? { ...existing } : emptyAddress(type) }));
        setEditMode((prev) => ({ ...prev, [type]: false }));
        setFieldErrors({});
    };

    const handleDeleteAddress = async (type: AddressType) => {
        const id = editingAddressId[type];
        if (!id) return;
        if (!window.confirm(`Are you sure you want to delete this ${type} address?`)) return;

        try {
            await removeAddress(id).unwrap();
            setFormData((prev) => ({ ...prev, [type]: emptyAddress(type) }));
            setEditingAddressId((prev) => ({ ...prev, [type]: null }));
            setEditMode((prev) => ({ ...prev, [type]: false }));
        } catch (err) {
            console.error('Failed to delete address:', err);
            alert('Failed to delete address. Please try again.');
        }
    };

    const renderAddressForm = (type: AddressType) => {
        const address = formData[type];
        const isEditing = editMode[type];
        const hasAddress = Boolean(address.fullName || address.line1);

        if (!isEditing) {
            return (
                <div>
                    {hasAddress ? (
                        <address className="mb-3">
                            {address.fullName && <strong>{address.fullName}</strong>}
                            {address.fullName && <br />}
                            {address.line1 && (
                                <>
                                    {address.line1}
                                    <br />
                                </>
                            )}
                            {address.line2 && (
                                <>
                                    {address.line2}
                                    <br />
                                </>
                            )}
                            {address.city && <>{address.city}</>}
                            {address.state && <>, {address.state}</>}
                            {address.zipCode && <> {address.zipCode}</>}
                            {(address.city || address.state || address.zipCode) && <br />}
                            {address.country && <>{address.country}</>}
                            {address.phone && (
                                <>
                                    <br />
                                    <i className="bx bx-phone me-1"></i>
                                    {address.phone}
                                </>
                            )}
                        </address>
                    ) : (
                        <p className="text-muted mb-3">No address added yet.</p>
                    )}

                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => toggleEditMode(type)}>
                            <i className="bx bx-edit me-1"></i>
                            {hasAddress ? 'Edit Address' : 'Add Address'}
                        </button>
                        {hasAddress && editingAddressId[type] && (
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAddress(type)}>
                                <i className="bx bx-trash me-1"></i>
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div className="address-form">
                <div className="mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                        type="text"
                        className={`form-control ${fieldErrors.fullName ? 'is-invalid' : ''}`}
                        value={address.fullName}
                        onChange={(e) => handleInputChange(type, 'fullName', e.target.value)}
                        placeholder="John Doe"
                    />
                    {fieldErrors.fullName && <div className="invalid-feedback d-block">{fieldErrors.fullName}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Address Line 1 *</label>
                    <input
                        type="text"
                        className={`form-control ${fieldErrors.line1 ? 'is-invalid' : ''}`}
                        value={address.line1}
                        onChange={(e) => handleInputChange(type, 'line1', e.target.value)}
                        placeholder="123 Main Street"
                    />
                    {fieldErrors.line1 && <div className="invalid-feedback d-block">{fieldErrors.line1}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Address Line 2 (Optional)</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address.line2}
                        onChange={(e) => handleInputChange(type, 'line2', e.target.value)}
                        placeholder="Apt 4B"
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">City *</label>
                        <input
                            type="text"
                            className={`form-control ${fieldErrors.city ? 'is-invalid' : ''}`}
                            value={address.city}
                            onChange={(e) => handleInputChange(type, 'city', e.target.value)}
                            placeholder="New York"
                        />
                        {fieldErrors.city && <div className="invalid-feedback d-block">{fieldErrors.city}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">State/Province *</label>
                        <input
                            type="text"
                            className={`form-control ${fieldErrors.state ? 'is-invalid' : ''}`}
                            value={address.state}
                            onChange={(e) => handleInputChange(type, 'state', e.target.value)}
                            placeholder="NY"
                        />
                        {fieldErrors.state && <div className="invalid-feedback d-block">{fieldErrors.state}</div>}
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">ZIP/Postal Code *</label>
                        <input
                            type="text"
                            className={`form-control ${fieldErrors.zipCode ? 'is-invalid' : ''}`}
                            value={address.zipCode}
                            onChange={(e) => handleInputChange(type, 'zipCode', e.target.value)}
                            placeholder="10001"
                        />
                        {fieldErrors.zipCode && <div className="invalid-feedback d-block">{fieldErrors.zipCode}</div>}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Country *</label>
                        <select
                            className={`form-select ${fieldErrors.country ? 'is-invalid' : ''}`}
                            value={address.country}
                            onChange={(e) => handleInputChange(type, 'country', e.target.value)}
                        >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="South Africa">South Africa</option>
                            <option value="Other">Other</option>
                        </select>
                        {fieldErrors.country && <div className="invalid-feedback d-block">{fieldErrors.country}</div>}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone Number (Optional)</label>
                    <input
                        type="tel"
                        className={`form-control ${fieldErrors.phone ? 'is-invalid' : ''}`}
                        value={address.phone}
                        onChange={(e) => handleInputChange(type, 'phone', e.target.value)}
                        placeholder="(123) 456-7890"
                    />
                    {fieldErrors.phone && <div className="invalid-feedback d-block">{fieldErrors.phone}</div>}
                </div>

                {type === 'shipping' && (
                    <div className="mb-3">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="sameAsBilling"
                                checked={sameAsBilling}
                                onChange={(e) => handleSameAsBillingChange(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="sameAsBilling">
                                Same as billing address
                            </label>
                        </div>
                    </div>
                )}

                <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={() => handleSaveAddress(type)} disabled={saving || userLoading}>
                        <i className="bx bx-save me-1"></i>
                        {saving ? 'Saving...' : 'Save Address'}
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => handleCancelEdit(type)} disabled={saving || userLoading}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <style>{addressStyles}</style>
            <section className="py-3 border-bottom d-none d-md-flex">
                <div className="container">
                    <div className="page-breadcrumb d-flex align-items-center">
                        <h3 className="breadcrumb-title pe-3">Account Addresses</h3>
                        <div className="ms-auto">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0 p-0">
                                    <li className="breadcrumb-item">
                                        <Link href="/">
                                            <i className="bx bx-home-alt"></i> Home
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <Link href="/dashboard">
                                            <i className="bx bx-user"></i> Dashboard
                                        </Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Addresses
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-4">
                <div className="container">
                    <h3 className="d-none">Account</h3>
                    <div className="card-body bg-dark-2 media-object">
                        <div className="card-body">
                            <div className="row">
                                <AccountSidebar currentUser={currentUser} userFullName={userFullName} />

                                <div className="col-lg-8">
                                    <div className="card shadow-none mb-0">
                                        <div className="card-body">
                                            {addressesLoading && !allAddresses.length ? (
                                                <div className="text-center py-5">
                                                    <div className="spinner-border text-primary" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-3">Loading addresses...</p>
                                                </div>
                                            ) : userError ? (
                                                <div className="alert alert-danger">
                                                    <i className="bx bx-error-circle me-2"></i>
                                                    Failed to load addresses. Please try again.
                                                </div>
                                            ) : (
                                                <>
                                                    <h6 className="mb-4">The following addresses will be used on the checkout page by default.</h6>

                                                    <div className="row">
                                                        <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <h5 className="mb-0">
                                                                    <i className="bx bx-receipt me-2"></i>
                                                                    Billing Address
                                                                </h5>
                                                                {formData.billing.fullName && !editMode.billing && (
                                                                    <span className="badge bg-success">
                                                                        <i className="bx bx-check"></i> Set
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {renderAddressForm('billing')}
                                                        </div>

                                                        <div className="col-12 col-lg-6">
                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <h5 className="mb-0">
                                                                    <i className="bx bx-package me-2"></i>
                                                                    Shipping Address
                                                                </h5>
                                                                {formData.shipping.fullName && !editMode.shipping && (
                                                                    <span className="badge bg-success">
                                                                        <i className="bx bx-check"></i> Set
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {renderAddressForm('shipping')}
                                                        </div>
                                                    </div>

                                                    {(!formData.billing.fullName || !formData.shipping.fullName) && (
                                                        <div className="alert alert-info mt-4">
                                                            <i className="bx bx-info-circle me-2"></i>
                                                            Please add your addresses to speed up the checkout process.
                                                        </div>
                                                    )}

                                                    {allAddresses.length > 0 && (
                                                        <div className="mt-4 pt-4 border-top">
                                                            <h6 className="mb-3">
                                                                <i className="bx bx-map me-2"></i>
                                                                All Saved Addresses ({allAddresses.length})
                                                            </h6>
                                                            <div className="text-muted small">
                                                                You have {billingAddresses.length} billing address(es) and {shippingAddresses.length} shipping
                                                                address(es) saved.
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AddressesView;