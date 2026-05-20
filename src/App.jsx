import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard, Receipt, PlusCircle, Wallet,
  ArrowUpRight, ArrowDownRight, Briefcase, Car, Users, BookOpen,
  HelpCircle, X, MapPin, Pencil, Trash2, Activity, Menu, Paperclip, Download, Eye, FileText, Image as ImageIcon
} from 'lucide-react';
import { initialTransactions, categories, expenseTypes } from './data';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('accounting_transactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old single attachments and add NL- prefix to IDs if missing
      return parsed.map(tx => {
        let updatedTx = { ...tx };
        if (updatedTx.attachment && !updatedTx.attachments) {
          updatedTx = {
            ...updatedTx,
            attachments: [{ data: updatedTx.attachment, name: updatedTx.attachmentName || 'Attachment' }],
            attachment: undefined,
            attachmentName: undefined
          };
        }
        if (!updatedTx.id.toString().startsWith('NL-')) {
          updatedTx.id = 'NL-' + updatedTx.id;
        }
        return updatedTx;
      });
    }
    return initialTransactions;
  });
  const [previewAttachment, setPreviewAttachment] = useState({ isOpen: false, files: [], activeIndex: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedType, setExpandedType] = useState(null);
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('accounting_activities');
    return saved ? JSON.parse(saved) : [];
  });
  const [editId, setEditId] = useState(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('accounting_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('accounting_activities', JSON.stringify(activities));
  }, [activities]);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    description: '',
    amount: '',
    category: 'Company',
    attachments: []
  });

  // Derived metrics
  const metrics = useMemo(() => {
    let totalFunding = 0;
    let totalExpenses = 0;
    let totalAssets = 0;
    let totalReturnable = 0;
    let totalPermanent = 0;

    transactions.forEach(t => {
      if (t.credit > 0) {
        totalFunding += t.credit;
      }
      if (t.debit > 0) {
        totalExpenses += t.debit;
        if (t.type === 'Assets') totalAssets += t.debit;
        if (t.type === 'Returnable') totalReturnable += t.debit;
        if (t.type === 'Permanent') totalPermanent += t.debit;
      }
    });

    return { totalFunding, totalExpenses, totalAssets, totalReturnable, totalPermanent, balance: totalFunding - totalExpenses, totalInvestment: totalAssets + totalReturnable };
  }, [transactions]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    const amount = parseFloat(formData.amount);
    let updatedTx;
    let newActivity;

    if (editId) {
      // Edit existing transaction
      updatedTx = transactions.find(t => t.id === editId);
      const isFunding = formData.category === 'Funding';

      let changes = [];
      const oldAmount = updatedTx.debit > 0 ? updatedTx.debit : updatedTx.credit;

      if (updatedTx.description !== formData.description) changes.push(`Desc: '${updatedTx.description}' to '${formData.description}'`);
      if (oldAmount !== amount) changes.push(`Amount: QAR ${oldAmount} to QAR ${amount}`);
      if (updatedTx.category !== formData.category) changes.push(`Category: ${updatedTx.category} to ${formData.category}`);
      if (updatedTx.date !== formData.date) changes.push(`Date: ${updatedTx.date} to ${formData.date}`);

      const changesText = changes.length > 0 ? changes.join(', ') : 'No visible changes made';

      const newTransactions = transactions.map(t => {
        if (t.id === editId) {
          return {
            ...t,
            date: formData.date,
            description: formData.description,
            debit: isFunding ? 0 : amount,
            credit: isFunding ? amount : 0,
            category: formData.category,
            type: isFunding ? 'Income' : expenseTypes[formData.category],
            attachments: formData.attachments
          };
        }
        return t;
      });
      setTransactions(newTransactions);

      newActivity = {
        id: Date.now().toString(),
        type: 'EDIT',
        title: `Edited Transaction ${editId} - ${updatedTx.description}`,
        description: changesText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      };
    } else {
      // Create new transaction
      const isFunding = formData.category === 'Funding';
      updatedTx = {
        id: 'NL-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000),
        date: formData.date,
        description: formData.description,
        debit: isFunding ? 0 : amount,
        credit: isFunding ? amount : 0,
        category: formData.category,
        type: isFunding ? 'Income' : expenseTypes[formData.category],
        attachments: formData.attachments
      };
      setTransactions([updatedTx, ...transactions]);

      newActivity = {
        id: Date.now().toString(),
        type: 'ADD',
        title: 'New Transaction Added',
        description: `Added transaction ${updatedTx.id}: ${formData.description} for QAR ${amount}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      };
    }

    setActivities([newActivity, ...activities]);
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), description: '', amount: '', category: 'Company', attachments: [] });
  };

  const handleEditTransaction = (tx) => {
    setEditId(tx.id);
    setFormData({
      date: tx.date || '',
      description: tx.description,
      amount: tx.debit > 0 ? tx.debit : tx.credit,
      category: tx.category,
      attachments: tx.attachments || []
    });
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      const txToDelete = transactions.find(t => t.id === id);
      setTransactions(transactions.filter(t => t.id !== id));

      const newActivity = {
        id: 'NL-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000),
        type: 'DELETE',
        title: 'Transaction Deleted',
        description: `Deleted transaction ${id}: ${txToDelete.description} (QAR ${txToDelete.debit > 0 ? txToDelete.debit : txToDelete.credit})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      };
      setActivities([newActivity, ...activities]);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (formData.attachments.length + files.length > 3) {
      alert('You can only attach a maximum of 3 files per transaction.');
      e.target.value = '';
      return;
    }

    const validFiles = files.filter(f => {
      if (f.size > 500 * 1024) {
        alert(`File ${f.name} exceeds 500KB limit and was skipped.`);
        return false;
      }
      return true;
    });

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, { data: reader.result, name: file.name, type: file.type }]
        }));
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Company': return <Briefcase size={16} />;
      case 'Vehicle': return <Car size={16} />;
      case 'Riders': return <Users size={16} />;
      case 'Driving School Payment': return <BookOpen size={16} />;
      case 'Transportation': return <MapPin size={16} />;
      default: return <HelpCircle size={16} />;
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Overlay */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/logo.png" alt="NL Logo" style={{ height: '36px', width: 'auto' }} />
          <span>NovaLink Accounting</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
          <a className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}>
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => { setActiveTab('transactions'); setIsMobileMenuOpen(false); }}>
            <Receipt size={20} />
            Transactions
          </a>
          <a className={`nav-item ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => { setActiveTab('activities'); setIsMobileMenuOpen(false); }}>
            <Activity size={20} />
            Activities
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header animate-fade-in">
          <div className="header-top">
            <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h1>{activeTab === 'dashboard' ? 'Overview' : activeTab === 'transactions' ? 'All Transactions' : 'Activity Log'}</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Track your investments and expenses effectively.</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => {
            setEditId(null);
            setFormData({ date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), description: '', amount: '', category: 'Company', attachment: null, attachmentName: '' });
            setIsModalOpen(true);
          }}>
            <PlusCircle size={20} />
            Add Expense
          </button>
        </header>

        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            {/* Metrics Grid */}
            <div className="metrics-grid">
              <div className="glass-panel metric-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="metric-title">Total Balance</div>
                    <div className="metric-value" style={{ color: metrics.balance >= 0 ? 'var(--text-primary)' : 'var(--danger-color)' }}>
                      QAR {metrics.balance.toLocaleString()}
                    </div>
                  </div>
                  <div className="metric-icon" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-color)' }}>
                    <Wallet size={24} />
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Total Funding: QAR {metrics.totalFunding.toLocaleString()}
                </div>
              </div>

              <div className="glass-panel metric-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="metric-title">Total Expenses</div>
                    <div className="metric-value" style={{ color: 'var(--danger-color)' }}>
                      QAR {metrics.totalExpenses.toLocaleString()}
                    </div>
                  </div>
                  <div className="metric-icon" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger-color)' }}>
                    <ArrowDownRight size={24} />
                  </div>
                </div>
              </div>

              <div className="glass-panel metric-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="metric-title">Total Investment</div>
                    <div className="metric-value" style={{ color: 'var(--success-color)' }}>
                      QAR {metrics.totalInvestment.toLocaleString()}
                    </div>
                  </div>
                  <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success-color)' }}>
                    <ArrowUpRight size={24} />
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Assets & Returnable Expenses
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div style={{ marginTop: '2rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Recent Transactions</h2>
              <button
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                onClick={() => setActiveTab('transactions')}
              >
                View All
              </button>
            </div>

            <div className="glass-panel" style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
              {transactions.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No transactions found.
                </div>
              ) : (
                <div className="category-tx-list" style={{ marginTop: 0, borderTop: 'none', paddingTop: '0.5rem' }}>
                  {transactions.slice(0, 5).map(tx => {
                    const isFunding = tx.category === 'Funding';
                    return (
                      <div key={tx.id} className="category-tx-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            <span>{tx.date || '-'}</span>
                            <span>•</span>
                            <span>{tx.id}</span>
                          </div>
                          <span className="tx-amount" style={{ fontSize: '0.85rem', fontWeight: 600, color: isFunding ? 'var(--accent-color)' : 'var(--danger-color)' }}>
                            QAR {isFunding ? tx.credit : tx.debit}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span className="tx-desc" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                            {tx.description}
                          </span>
                          <div className="tx-actions">
                            <button className="btn-icon edit" onClick={() => handleEditTransaction(tx)} title="Edit">
                              <Pencil size={14} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDeleteTransaction(tx.id)} title="Delete">
                              <Trash2 size={14} />
                            </button>
                            {tx.attachments && tx.attachments.length > 0 && (
                              <button className="btn-icon" onClick={() => setPreviewAttachment({ isOpen: true, files: tx.attachments, activeIndex: 0 })} title="View Attachments">
                                <Paperclip size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Expense Type Overview */}
            <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Expense Type Overview</h2>
            </div>

            <div className="category-grid">
              {['Assets', 'Returnable', 'Permanent'].map(typeId => {
                const typeTransactions = transactions.filter(t => t.type === typeId);
                const isIncome = typeId === 'Income';

                const totalAmount = typeTransactions.reduce((sum, tx) => {
                  return sum + (isIncome ? tx.credit : tx.debit);
                }, 0);

                const isExpanded = expandedType === typeId;

                let iconColor = 'var(--text-secondary)';
                if (typeId === 'Income') iconColor = 'var(--accent-color)';
                if (typeId === 'Assets') iconColor = 'var(--asset-color)';
                if (typeId === 'Returnable') iconColor = 'var(--success-color)';
                if (typeId === 'Permanent') iconColor = 'var(--danger-color)';

                return (
                  <div key={typeId} className="glass-panel category-summary-card">
                    <div className="category-summary-header">
                      <div className="metric-icon" style={{ background: 'rgba(0,0,0,0.04)', width: 36, height: 36, color: iconColor }}>
                        {isIncome ? <PlusCircle size={16} /> : <ArrowDownRight size={16} />}
                      </div>
                      {typeId}
                    </div>

                    <div className="category-summary-amount" style={{ color: iconColor }}>
                      {isIncome ? '+' : '-'} QAR {totalAmount.toLocaleString()}
                    </div>

                    <button
                      className="btn btn-outline"
                      onClick={() => setExpandedType(isExpanded ? null : typeId)}
                    >
                      {isExpanded ? 'Hide Transactions' : 'Show all transactions'}
                    </button>

                    {isExpanded && (
                      <div className="category-tx-list animate-fade-in">
                        {typeTransactions.length === 0 ? (
                          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            No transactions yet
                          </div>
                        ) : (
                          typeTransactions.map(tx => (
                            <div key={tx.id} className="category-tx-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  <span>{tx.date || '-'}</span>
                                  <span>•</span>
                                  <span>{tx.id}</span>
                                </div>
                                <span className="tx-amount" style={{ fontSize: '0.85rem', fontWeight: 600, color: isIncome ? 'var(--accent-color)' : 'var(--danger-color)' }}>
                                  QAR {isIncome ? tx.credit : tx.debit}
                                </span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span className="tx-desc" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                                  {tx.description}
                                </span>
                                {tx.attachments && tx.attachments.length > 0 && (
                                  <div className="tx-actions">
                                    <button className="btn-icon" onClick={() => setPreviewAttachment({ isOpen: true, files: tx.attachments, activeIndex: 0 })} title="View Attachments">
                                      <Paperclip size={14} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Category Grid */}
            <div style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Expenses by Category</h2>
            </div>

            <div className="category-grid">
              {['Funding', ...categories.map(c => c.id)].map(categoryId => {
                const categoryTransactions = transactions.filter(t => t.category === categoryId);
                const isFunding = categoryId === 'Funding';

                const totalAmount = categoryTransactions.reduce((sum, tx) => {
                  return sum + (isFunding ? tx.credit : tx.debit);
                }, 0);

                const isExpanded = expandedCategory === categoryId;

                return (
                  <div key={categoryId} className="glass-panel category-summary-card">
                    <div className="category-summary-header">
                      <div className="metric-icon" style={{ background: 'rgba(0,0,0,0.04)', width: 36, height: 36 }}>
                        {categoryId !== 'Funding' ? getCategoryIcon(categoryId) : <Wallet size={16} />}
                      </div>
                      {categoryId}
                    </div>

                    <div className="category-summary-amount" style={{ color: isFunding ? 'var(--accent-color)' : 'var(--danger-color)' }}>
                      {isFunding ? '+' : '-'} QAR {totalAmount.toLocaleString()}
                    </div>

                    <button
                      className="btn btn-outline"
                      onClick={() => setExpandedCategory(isExpanded ? null : categoryId)}
                    >
                      {isExpanded ? 'Hide Transactions' : 'Show all transactions'}
                    </button>

                    {isExpanded && (
                      <div className="category-tx-list animate-fade-in">
                        {categoryTransactions.length === 0 ? (
                          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            No transactions yet
                          </div>
                        ) : (
                          categoryTransactions.map(tx => (
                            <div key={tx.id} className="category-tx-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  <span>{tx.date || '-'}</span>
                                  <span>•</span>
                                  <span>{tx.id}</span>
                                </div>
                                <span className="tx-amount" style={{ fontSize: '0.85rem', fontWeight: 600, color: isFunding ? 'var(--accent-color)' : 'var(--danger-color)' }}>
                                  QAR {isFunding ? tx.credit : tx.debit}
                                </span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span className="tx-desc" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                                  {tx.description}
                                </span>
                                <div className="tx-actions">
                                  <button className="btn-icon edit" onClick={() => handleEditTransaction(tx)} title="Edit">
                                    <Pencil size={14} />
                                  </button>
                                  <button className="btn-icon delete" onClick={() => handleDeleteTransaction(tx.id)} title="Delete">
                                    <Trash2 size={14} />
                                  </button>
                                  {tx.attachments && tx.attachments.length > 0 && (
                                    <button className="btn-icon" onClick={() => setPreviewAttachment({ isOpen: true, files: tx.attachments, activeIndex: 0 })} title="View Attachments">
                                      <Paperclip size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="glass-panel table-container animate-fade-in">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Debit (Out)</th>
                  <th style={{ textAlign: 'right' }}>Credit (In)</th>
                  <th style={{ textAlign: 'center', width: '80px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{tx.id}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{tx.date || '-'}</td>
                    <td style={{ fontWeight: 500 }}>{tx.description}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        {getCategoryIcon(tx.category)}
                        {tx.category}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{
                        background: tx.type === 'Assets' ? 'rgba(139, 92, 246, 0.2)' :
                          tx.type === 'Returnable' ? 'rgba(16, 185, 129, 0.2)' :
                            tx.type === 'Income' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: tx.type === 'Assets' ? 'var(--asset-color)' :
                          tx.type === 'Returnable' ? 'var(--success-color)' :
                            tx.type === 'Income' ? 'var(--accent-color)' : 'var(--danger-color)'
                      }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {tx.debit > 0 ? `QAR ${tx.debit}` : '-'}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--accent-color)' }}>
                      {tx.credit > 0 ? `QAR ${tx.credit}` : '-'}
                    </td>
                    <td>
                      <div className="tx-actions" style={{ marginLeft: 0, justifyContent: 'center' }}>
                        <button className="btn-icon edit" onClick={() => handleEditTransaction(tx)} title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDeleteTransaction(tx.id)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                        {tx.attachments && tx.attachments.length > 0 && (
                          <button className="btn-icon" onClick={() => setPreviewAttachment({ isOpen: true, files: tx.attachments, activeIndex: 0 })} title="View Attachments" style={{ color: 'inherit' }}>
                            <Paperclip size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="animate-fade-in">
            {activities.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Activity size={48} style={{ opacity: 0.5, marginBottom: '1rem', margin: '0 auto' }} />
                <h3>No activities recorded yet.</h3>
                <p>Add, edit, or delete transactions to see them appear here.</p>
              </div>
            ) : (
              <div className="timeline-container">
                {activities.map(activity => (
                  <div key={activity.id} className="timeline-item">
                    <div className={`timeline-icon ${activity.type.toLowerCase()}`}>
                      {activity.type === 'ADD' && <PlusCircle size={20} />}
                      {activity.type === 'EDIT' && <Pencil size={20} />}
                      {activity.type === 'DELETE' && <Trash2 size={20} />}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <div className="timeline-title">{activity.title}</div>
                        <div className="timeline-time">{activity.date} at {activity.time}</div>
                      </div>
                      <div className="timeline-body">
                        {activity.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Expense Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => { setIsModalOpen(false); setEditId(null); }}>
        <div className="glass-panel modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{editId ? 'Edit Transaction' : 'Add New Expense'}</h2>
            <button className="modal-close" onClick={() => { setIsModalOpen(false); setEditId(null); }}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleAddExpense}>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Office Rent"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="form-label">Amount (QAR)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="form-label">Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  placeholder="DD-Mon"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Funding">Funding</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Attachments (Max 3 files, 500KB each)</label>
              {formData.attachments && formData.attachments.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {formData.attachments.map((file, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                        <Paperclip size={16} color="var(--accent-color)" />
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(idx)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-color)', display: 'flex', alignItems: 'center' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {(!formData.attachments || formData.attachments.length < 3) && (
                <input
                  type="file"
                  multiple
                  className="form-control"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  style={{ padding: '0.5rem' }}
                />
              )}
            </div>

            <div className="form-group" style={{ padding: '1rem', background: 'rgba(0,0,0,0.04)', borderRadius: '8px', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Type:</span>
                <span style={{ fontWeight: 600 }}>{expenseTypes[formData.category]}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {formData.category === 'Vehicle' ? 'This expense will be added to your total assets.' :
                  expenseTypes[formData.category] === 'Returnable' ? 'This expense will be marked as returnable investment.' :
                    'This expense is permanent and not returnable.'}
              </p>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
              {editId ? 'Update Transaction' : 'Save Expense'}
            </button>
          </form>
        </div>
      </div>

      {/* Attachment Preview Modal */}
      <div className={`modal-overlay ${previewAttachment.isOpen ? 'active' : ''}`} onClick={() => setPreviewAttachment({ isOpen: false, files: [], activeIndex: 0 })}>
        <div className="glass-panel modal-content preview-modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Attachment Preview</h2>
            <button className="modal-close" onClick={() => setPreviewAttachment({ isOpen: false, files: [], activeIndex: 0 })}>
              <X size={24} />
            </button>
          </div>

          {previewAttachment.files.length > 0 && (
            <>
              {previewAttachment.files.length > 1 && (
                <div className="preview-gallery">
                  {previewAttachment.files.map((file, idx) => (
                    <div
                      key={idx}
                      className={`preview-gallery-item ${previewAttachment.activeIndex === idx ? 'active' : ''}`}
                      onClick={() => setPreviewAttachment(prev => ({ ...prev, activeIndex: idx }))}
                    >
                      {file.type?.includes('pdf') || file.name?.toLowerCase().endsWith('.pdf') ? <FileText size={16} /> : <ImageIcon size={16} />}
                      <span style={{ fontSize: '0.85rem', whiteSpace: 'nowrap', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="preview-viewer">
                {previewAttachment.files[previewAttachment.activeIndex]?.type?.includes('pdf') || previewAttachment.files[previewAttachment.activeIndex]?.name?.toLowerCase().endsWith('.pdf') ? (
                  <iframe src={previewAttachment.files[previewAttachment.activeIndex]?.data} title="PDF Preview" />
                ) : (
                  <img src={previewAttachment.files[previewAttachment.activeIndex]?.data} alt="Preview" />
                )}
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  className="btn btn-primary"
                  href={previewAttachment.files[previewAttachment.activeIndex]?.data}
                  download={previewAttachment.files[previewAttachment.activeIndex]?.name || 'attachment'}
                >
                  <Download size={18} />
                  Download File
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
