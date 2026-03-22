import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
    fetchOrders, fetchOrdersWithFilters, cancelOrder, setCurrentOrder,
    setOrderFilters, clearOrderFilters,
    selectAllOrders, selectOrdersLoading, selectOrdersError,
    selectOrderFilters, selectTotalOrderValue, clearError,
} from '../../features/orders/slice';
import { selectCurrentUser, selectIsAuthenticated, logoutUser } from '../../features/user/slice';
import AccountSidebar from './components/AccountSidebar';
import { T, orderStyles } from "./styles";


const SA={completed:'#2a9d8f',delivered:'#2a9d8f',shipped:'#4dabf7',processing:'#f4a261',pending:'rgba(255,255,255,0.32)',failed:'#e63946',cancelled:'#444'};
const SFS=['all','pending','processing','shipped','delivered','completed','cancelled','failed'];
const fmtDate=d=>d?new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}):'—';
const itemCount=o=>!o.items?.length?0:o.items.reduce((s,i)=>s+(i.quantity||0),0);



function AccountOrders() {
    const dispatch=useDispatch(), navigate=useNavigate();
    const orders=useSelector(selectAllOrders), loading=useSelector(selectOrdersLoading),
          error=useSelector(selectOrdersError), currentUser=useSelector(selectCurrentUser),
          isAuthenticated=useSelector(selectIsAuthenticated), totalOrderValue=useSelector(selectTotalOrderValue);
    const [cancellingId,setCancellingId]=useState(null);
    const [showFilters,setShowFilters]=useState(false);
    const [statusFilter,setStatusFilter]=useState('all');

    useEffect(()=>{if(!isAuthenticated)navigate('/login?redirect=/account/orders');},[isAuthenticated,navigate]);
    useEffect(()=>{if(isAuthenticated)dispatch(fetchOrders({sort:'-orderDate'}));},[dispatch,isAuthenticated]);
    useEffect(()=>{
        if(statusFilter!=='all'){dispatch(setOrderFilters({status:statusFilter}));dispatch(fetchOrdersWithFilters());}
        else{dispatch(clearOrderFilters());dispatch(fetchOrders({sort:'-orderDate'}));}
    },[statusFilter,dispatch]);

    const handleView=(order)=>{dispatch(setCurrentOrder(order));navigate(`/account/orders/${order.id}`);};
    const handlePay=(order)=>{dispatch(setCurrentOrder(order));navigate('/checkout/payment',{state:{orderId:order.id}});};
    const handleCancel=async(orderId)=>{
        if(!window.confirm('Cancel this order?'))return;
        setCancellingId(orderId);
        const result=await dispatch(cancelOrder(orderId,'Customer requested cancellation'));
        if(result.success)dispatch(fetchOrders({sort:'-orderDate'}));
        else alert(result.error||'Failed to cancel order');
        setCancellingId(null);
    };

    const canCancel=(o)=>['pending','processing'].includes(o.status?.toLowerCase());
    const canPay=(o)=>['failed','pending'].includes(o.status?.toLowerCase());
    const sorted=[...(statusFilter==='all'?orders:orders.filter(o=>o.status?.toLowerCase()===statusFilter))]
        .sort((a,b)=>new Date(b.orderDate||b.createdAt)-new Date(a.orderDate||a.createdAt));
    const activeCount=orders.filter(o=>['pending','processing'].includes(o.status?.toLowerCase())).length;

    return (
        <>
            <style>{orderStyles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Anton&family=Space+Mono:ital@0;1&display=swap" rel="stylesheet"/>
            <div className="op">

                {/* HERO */}
                <section className="oh">
                    <div className="oh-stripe"/>
                    <div className="oh-ghost" aria-hidden>ORDERS</div>
                    <div className="oh-inner">
                        <div className="oh-bc">
                            <Link to="/" className="oh-bc a" style={{fontFamily:"'Space Mono',monospace",fontSize:'.65rem',letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.32)',textDecoration:'none'}}>Home</Link>
                            <span className="oh-bc-sep">✦</span>
                            <Link to="/account/dashboard" style={{fontFamily:"'Space Mono',monospace",fontSize:'.65rem',letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,0.32)',textDecoration:'none'}}>Account</Link>
                            <span className="oh-bc-sep">✦</span>
                            <span className="oh-bc-cur">My Orders</span>
                        </div>
                        <span className="oh-eyebrow">My Account</span>
                        <h1 className="oh-title">My <span>Orders</span></h1>
                    </div>
                </section>

                {/* LAYOUT */}
                <div className="ol">
                    <AccountSidebar currentUser={currentUser}/>
                    <main>

                        {/* Stats */}
                        <div className="os">
                            {[
                                {val:orders.length,lbl:'Total Orders',sa:T.red},
                                {val:`$${(totalOrderValue||0).toFixed(2)}`,lbl:'Total Spent',sa:T.orange},
                                {val:activeCount,lbl:'Active Orders',sa:T.teal},
                            ].map(s=>(
                                <div key={s.lbl} className="os-item" style={{'--sa':s.sa}}>
                                    <span className="os-val">{s.val}</span>
                                    <span className="os-lbl">{s.lbl}</span>
                                </div>
                            ))}
                        </div>

                        {/* Toolbar */}
                        <div className="otb">
                            <h2 className="otb-title">
                                Order History
                                {statusFilter!=='all'&&<span style={{color:T.red,fontFamily:"'Space Mono',monospace",fontSize:'.7rem',marginLeft:'.75rem'}}> — {statusFilter}</span>}
                            </h2>
                            <button className={`otb-btn${showFilters?' act':''}`} onClick={()=>setShowFilters(s=>!s)}>
                                ▼ Filter{statusFilter!=='all'&&` (${statusFilter})`}
                            </button>
                        </div>

                        {/* Filter drawer */}
                        {showFilters&&(
                            <div className="ofd">
                                <div>
                                    <span className="ofd-lbl">Status</span>
                                    <select className="ofd-sel" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                                        {SFS.map(s=>(
                                            <option key={s} value={s}>{s==='all'?'All Orders':s.charAt(0).toUpperCase()+s.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                {statusFilter!=='all'&&(
                                    <button className="ofd-clr" onClick={()=>{setStatusFilter('all');dispatch(clearOrderFilters());}}>✕ Clear</button>
                                )}
                            </div>
                        )}

                        {/* Error */}
                        {error&&(
                            <div className="o-err">
                                <span>⚠</span>
                                <span style={{flex:1}}>{error}</span>
                                <button className="o-err-close" onClick={()=>dispatch(clearError())}>✕</button>
                            </div>
                        )}

                        {/* Loading */}
                        {loading&&<div className="o-ldg"><div className="o-ldg-spin"/></div>}

                        {/* Empty */}
                        {!loading&&sorted.length===0&&(
                            <div className="o-empty">
                                <span className="o-empty-icon">📭</span>
                                <h3 className="o-empty-title">No orders found</h3>
                                <p className="o-empty-sub">
                                    {statusFilter!=='all'
                                        ?`No ${statusFilter} orders. Try a different filter.`
                                        :"You haven't placed any orders yet."}
                                </p>
                                {statusFilter==='all'
                                    ?<Link to="/shop" className="o-btn-primary">🛍️ Browse Products</Link>
                                    :<button className="o-btn-primary" onClick={()=>setStatusFilter('all')}>View All Orders</button>
                                }
                            </div>
                        )}

                        {/* Order cards */}
                        {!loading&&sorted.map(order=>{
                            const sk=order.status?.toLowerCase()||'pending';
                            const sc=SA[sk]||T.textDim;
                            const slbl=(order.status?.charAt(0).toUpperCase()+order.status?.slice(1))||'Pending';
                            const ic=itemCount(order);
                            return (
                                <div key={order.id} className="oc" style={{'--sc':sc}}>
                                    <div className="oc-head">
                                        <span className="oc-num">Order <span>#{order.orderNumber||order.id}</span></span>
                                        <div className="oc-pill"><span className="oc-dot"/>{slbl}</div>
                                    </div>
                                    <div className="oc-body">
                                        <div>
                                            <span className="oc-fl">Date</span>
                                            <span className="oc-fv">{fmtDate(order.orderDate||order.createdAt)}</span>
                                        </div>
                                        <div>
                                            <span className="oc-fl">Total</span>
                                            <span className="oc-fv" style={{color:T.orange}}>${(order.total||0).toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span className="oc-fl">Items</span>
                                            <span className="oc-fv">{ic} item{ic!==1?'s':''}</span>
                                        </div>
                                        <div className="oc-actions">
                                            <button className="ob ob-v" onClick={()=>handleView(order)}>View →</button>
                                            {canPay(order)&&<button className="ob ob-p" onClick={()=>handlePay(order)}>💳 Pay</button>}
                                            {canCancel(order)&&(
                                                <button className="ob ob-x" onClick={()=>handleCancel(order.id)} disabled={cancellingId===order.id}>
                                                    {cancellingId===order.id?<><div className="o-spin"/> Cancelling…</>:'✕ Cancel'}
                                                </button>
                                            )}
                                            {order.trackingNumber&&(
                                                <button className="ob ob-t" onClick={()=>window.open(`/track/${order.trackingNumber}`,'_blank')}>📡 Track</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </main>
                </div>

                <div className="o-ab"/>
            </div>
        </>
    );
}

export default AccountOrders;