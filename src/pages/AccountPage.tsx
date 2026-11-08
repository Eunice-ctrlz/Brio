import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/context/AuthContext';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import type { Address, Customer, Order } from '@/types';
import { formatDate, formatPrice } from '@/utils/format';

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state state--error" role="alert">
      <p>{message}</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function ProfileCard({ customer }: { customer: Customer }) {
  const initials = `${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}`.toUpperCase();
  return (
    <div className="panel profile">
      <div className="profile__avatar" aria-hidden="true">
        {initials}
      </div>
      <div>
        <h3 className="profile__name">
          {customer.firstName} {customer.lastName}
        </h3>
        <dl className="profile__details">
          <div>
            <dt>Email</dt>
            <dd>{customer.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{customer.phone ?? '—'}</dd>
          </div>
          <div>
            <dt>Member since</dt>
            <dd>{formatDate(customer.memberSince)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function AddressCard({ address }: { address: Address }) {
  return (
    <address className="panel address">
      <div className="address__top">
        <strong>{address.label}</strong>
        {address.isDefault && <span className="badge">Default</span>}
      </div>
      <p>{address.recipient}</p>
      <p>
        {address.line1}
        {address.line2 && <>, {address.line2}</>}
      </p>
      <p>
        {address.city}, {address.region} {address.postalCode}
      </p>
      <p>{address.country}</p>
    </address>
  );
}

function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="state">
        <h3>No orders yet</h3>
        <p>When you place an order it will show up here.</p>
        <Button as="link" to="/products">
          Start shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <caption className="sr-only">Your orders</caption>
        <thead>
          <tr>
            <th scope="col">Order</th>
            <th scope="col">Date</th>
            <th scope="col">Items</th>
            <th scope="col" className="table__num">
              Total
            </th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <th scope="row">{order.orderNumber}</th>
              <td>{formatDate(order.createdAt)}</td>
              <td>
                <ul className="table__items">
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      {item.quantity} × {item.name}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="table__num">{formatPrice(order.total)}</td>
              <td>
                <StatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profile = useApi((signal) => api.getProfile(signal), []);
  const orders = useApi((signal) => api.getOrders(signal), []);

  const activeCustomer = user || profile.data;

  function handleSignOut() {
    logout();
    navigate('/login');
  }

  return (
    <div className="container page">
      <header className="page__head">
        <div>
          <p className="eyebrow">My account</p>
          <h1>{activeCustomer ? `Hi, ${activeCustomer.firstName}` : 'Your account'}</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </header>

      <section className="account__section" aria-labelledby="profile-title">
        <h2 id="profile-title">Profile</h2>
        {activeCustomer ? (
          <ProfileCard customer={activeCustomer} />
        ) : profile.error ? (
          <ErrorState message={profile.error} onRetry={profile.retry} />
        ) : (
          <div className="skeleton skeleton--panel" aria-busy="true" />
        )}
      </section>

      <section className="account__section" aria-labelledby="addresses-title">
        <h2 id="addresses-title">Saved addresses</h2>
        {activeCustomer && activeCustomer.addresses.length > 0 ? (
          <div className="address-grid">
            {activeCustomer.addresses.map((a) => (
              <AddressCard key={a.id} address={a} />
            ))}
          </div>
        ) : (
          <div className="state">
            <p>You haven’t saved any addresses yet.</p>
          </div>
        )}
      </section>

      <section className="account__section" aria-labelledby="orders-title">
        <h2 id="orders-title">Order history</h2>
        {orders.error ? (
          <ErrorState message={orders.error} onRetry={orders.retry} />
        ) : orders.loading || !orders.data ? (
          <div className="skeleton skeleton--panel" aria-busy="true" />
        ) : (
          <OrdersTable orders={orders.data} />
        )}
      </section>
    </div>
  );
}