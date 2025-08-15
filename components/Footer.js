export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white p-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2023-{currentYear} R&B Versus LIVE. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <a href="/contact" className="hover:text-gray-300">Contact</a>
          <a href="/blog" className="hover:text-gray-300">Blog</a>
          <a href="/products" className="hover:text-gray-300">Products</a>
        </div>
      </div>
    </footer>
  )
}
