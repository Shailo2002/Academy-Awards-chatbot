"use client";

import React, { useEffect, useState } from 'react';
import { Home, LayoutGrid, Tag, User, MessageSquare, Plus, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

interface ChatHistory {
  _id: string;
  title: string;
}

export default function Sidebar() {
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        if (data.chats) {
          setHistory(data.chats);
        }
      })
      .catch(console.error);
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await fetch('/api/auth/signout', { method: 'POST' });
    router.push('/signin');
    router.refresh();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoBadge}></div> The Envelope
        </div>
        <div className={styles.subtitle}>Academy Awards Bot</div>
      </div>
      
      <nav className={styles.nav}>
        <div className={styles.navGroup}>
          <Link href="/" className={`${styles.navItem} ${styles.active}`}>
            <Plus className={styles.icon} size={18} /> New Chat
          </Link>
        </div>

        <div className={styles.navGroup} style={{ marginTop: '1.5rem' }}>
          <p className={styles.navLabel}>Recent History</p>
          {history.length === 0 ? (
            <div style={{ padding: '0 1rem', fontSize: '0.85rem', color: 'var(--color-secondary)', opacity: 0.6 }}>
              No chats yet.
            </div>
          ) : (
            history.map(chat => (
              <a href={`/?chatId=${chat._id}`} className={styles.navItem} key={chat._id}>
                <MessageSquare className={styles.icon} size={16} /> 
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {chat.title}
                </span>
              </a>
            ))
          )}
        </div>
      </nav>

      <div className={styles.footer}>
        <a href="#" className={styles.navItem} onClick={handleLogout}>
          <LogOut className={styles.icon} size={18} /> Sign Out
        </a>
      </div>
    </aside>
  );
}
