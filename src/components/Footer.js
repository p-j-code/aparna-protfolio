export default function Footer() {
  return (
    <footer className="py-8 px-6 text-center">
      <div className="container mx-auto">
        <p className="text-gray-600">
          © {new Date().getFullYear()} Aparna Munagekar. Designed with ❤️ in Mumbai
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Creating meaningful designs that connect with people
        </p>
      </div>
    </footer>
  )
}