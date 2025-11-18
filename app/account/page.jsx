export default function Account() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-[var(--light-color)] rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-[var(--dark-color)] mb-2">Account</h1>
        <p className="text-[var(--text-muted)] mb-6">Manage your account, orders, and preferences.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-[var(--bg-muted)] rounded-lg bg-[var(--light-color)]">
            <h3 className="font-semibold text-[var(--dark-color)] mb-2">Profile</h3>
            <p className="text-[var(--text-muted)] text-sm">View and update your profile information.</p>
          </div>

          <div className="p-4 border border-[var(--bg-muted)] rounded-lg bg-[var(--light-color)]">
            <h3 className="font-semibold text-[var(--dark-color)] mb-2">Orders</h3>
            <p className="text-[var(--text-muted)] text-sm">See your past orders and order status.</p>
          </div>

          <div className="p-4 border border-[var(--bg-muted)] rounded-lg bg-[var(--light-color)]">
            <h3 className="font-semibold text-[var(--dark-color)] mb-2">Addresses</h3>
            <p className="text-[var(--text-muted)] text-sm">Manage shipping and billing addresses.</p>
          </div>

          <div className="p-4 border border-[var(--bg-muted)] rounded-lg bg-[var(--light-color)]">
            <h3 className="font-semibold text-[var(--dark-color)] mb-2">Security</h3>
            <p className="text-[var(--text-muted)] text-sm">Change password and enable 2FA.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
