export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <div>
      <h3
        style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          color: '#6b7280',
          marginBottom: '1rem',
          letterSpacing: '0.5px',
        }}
      >
        Categories
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            style={{
              padding: '0.75rem 1rem',
              textAlign: 'left',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor:
                selectedCategory === category ? '#3b82f6' : '#f3f4f6',
              color: selectedCategory === category ? '#ffffff' : '#1f2937',
              fontWeight: selectedCategory === category ? 600 : 500,
              textTransform: 'capitalize',
            }}
            onMouseOver={(e) => {
              if (selectedCategory !== category) {
                e.target.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseOut={(e) => {
              if (selectedCategory !== category) {
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
