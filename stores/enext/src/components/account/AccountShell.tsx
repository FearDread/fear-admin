'use client';

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { ACCOUNT_SECTIONS, type AccountSection } from '@/lib/account/sections';
import { T } from '@/components/styles';
import AccountSidebar from './AccountSidebar';

/**
 * One hero + sidebar + content shell for all five account pages. The old views
 * each rendered their own hero (three different designs, two of them plain
 * Bootstrap); now they only render their main panel and this owns the chrome.
 */
export default function AccountShell({ section, children }: { section: AccountSection; children: ReactNode }) {
    const cfg = ACCOUNT_SECTIONS[section];
    const [prefix, accentWord] = cfg.heading;

    return (
        <div className="acct-page" style={{ '--acct-accent': T[cfg.accent] } as CSSProperties}>
            <section className="acct-hero">
                <div className="acct-hero-stripe" />
                <div className="acct-hero-ghost" aria-hidden="true">{cfg.ghost}</div>
                <div className="acct-hero-inner">
                    <nav className="acct-crumb" aria-label="Breadcrumb">
                        <Link href="/">Home</Link>
                        <span className="sep">✦</span>
                        {section === 'dashboard' ? (
                            <span className="cur">Account</span>
                        ) : (
                            <>
                                <Link href="/account/dashboard">Account</Link>
                                <span className="sep">✦</span>
                                <span className="cur">{cfg.title}</span>
                            </>
                        )}
                    </nav>
                    <span className="acct-eyebrow">My Account</span>
                    <h1 className="acct-hero-title">
                        {prefix} <span>{accentWord}</span>
                    </h1>
                </div>
            </section>

            <div className="acct-layout">
                <AccountSidebar />
                <main className="acct-main">{children}</main>
            </div>

            <div className="acct-animated-border" />
        </div>
    );
}