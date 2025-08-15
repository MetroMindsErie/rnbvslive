export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white p-8">
      <div className="container mx-auto text-center">
        <p>&copy; 2023-{currentYear} R&B Versus LIVE. All rights reserved.</p>
      </div>
    </footer>
  )
}
