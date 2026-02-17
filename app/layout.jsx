import './globals.css'

export const metadata = {
  title: 'Smart Bookmark App',
  description: 'A beautiful app to organize and manage your bookmarks with ease. Create, edit, search, and organize bookmarks by category.',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
