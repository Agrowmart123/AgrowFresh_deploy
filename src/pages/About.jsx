import React from 'react'

export default function About() {
  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">About Agfresh</h1>
      <p className="text-gray-700 mb-4">Agfresh is a demo hyperlocal marketplace connecting customers with nearby kirana and grocery shops. This demo is inspired by LoveLocal's marketplace patterns: quick delivery, local shops, curated selections, and community-first values.</p>
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Our Mission</h3>
          <p className="text-gray-600">Empower local shops with digital tools while delivering fresh groceries to customers nearby.</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">How it works</h3>
          <ol className="list-decimal pl-5 text-gray-600">
            <li>Select a shop nearby</li>
            <li>Add items to cart and checkout</li>
            <li>Shop prepares order and delivery arrives fast</li>
          </ol>
        </div>
      </section>
    </main>
  )
}
