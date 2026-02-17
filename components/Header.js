import AuthButton from './AuthButton';

export default function Header({ onSearch, user, onAuthChange }) {
  return (
    <header
      style={{
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        padding: '1.5rem 2rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>
              📚 Smart Bookmarks
            </h1>
            <p style={{ fontSize: '0.875rem', margin: '0.25rem 0 0 0', opacity: 0.9 }}>
              Organize, manage, and access your favorite links
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user && (
              <input
                type="text"
                placeholder="Search bookmarks..."
                onChange={(e) => onSearch(e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  width: '300px',
                  fontSize: '0.875rem',
                }}
              />
            )}
            <AuthButton user={user} onAuthChange={onAuthChange} />
          </div>
        </div>
      </div>
    </header>
  );
}
