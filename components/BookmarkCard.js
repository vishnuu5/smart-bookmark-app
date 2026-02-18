'use client';

import { useState } from 'react';

export default function BookmarkCard({ bookmark, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(bookmark);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleEdit = () => {
    if (isEditing && editData !== bookmark) {
      onUpdate(bookmark.id, editData);
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const openLink = () => {
    try {
      const url = editData.url.startsWith('http')
        ? editData.url
        : `https://${editData.url}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to open link:', error);
    }
  };

  const getDomain = (url) => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        padding: '1rem',
        transition: 'all 0.2s',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow =
          '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
      }}
    >
      {isEditing ? (
        <div>
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
            }}
          />
          <input
            type="url"
            name="url"
            value={editData.url}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
            }}
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
              minHeight: '60px',
              fontFamily: 'inherit',
            }}
          />
          <select
            name="category"
            value={editData.category}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
            }}
          >
            <option>General</option>
            <option>Work</option>
            <option>Learning</option>
            <option>Entertainment</option>
            <option>Tools</option>
            <option>News</option>
          </select>
        </div>
      ) : (
        <div>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '0.5rem',
              wordBreak: 'break-word',
            }}
          >
            {editData.title}
          </h3>

          <p
            style={{
              fontSize: '0.75rem',
              color: '#3b82f6',
              marginBottom: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'none',
              wordBreak: 'break-all',
            }}
            onClick={openLink}
            title={editData.url}
          >
            {getDomain(editData.url)}
          </p>

          {editData.description && (
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '1rem',
                lineHeight: '1.4',
              }}
            >
              {editData.description}
            </p>
          )}

          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'capitalize',
              }}
            >
              {editData.category}
            </span>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <button
          onClick={openLink}
          style={{
            flex: 1,
            padding: '0.5rem',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#1e40af')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#3b82f6')}
        >
          Open
        </button>

        <button
          onClick={() => setIsFavorite(!isFavorite)}
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: isFavorite ? '#fbbf24' : '#f3f4f6',
            color: isFavorite ? '#ffffff' : '#6b7280',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => {
            if (!isFavorite) {
              e.target.style.backgroundColor = '#e5e7eb';
            }
          }}
          onMouseOut={(e) => {
            if (!isFavorite) {
              e.target.style.backgroundColor = '#f3f4f6';
            }
          }}
        >
          {isFavorite ? '★' : '☆'}
        </button>

        <button
          onClick={handleEdit}
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#e5e7eb')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
        >
          {isEditing ? '✓' : '✎'}
        </button>

        <button
          onClick={() => onDelete(bookmark.id)}
          style={{
            padding: '0.5rem 0.75rem',
            backgroundColor: '#f3f4f6',
            color: '#ef4444',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#fee2e2')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
