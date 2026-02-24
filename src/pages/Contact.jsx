import React from 'react'

export default function Contact() {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-700 mb-4">For support, feedback or enquiries, reach out to our demo team.</p>

      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={(e)=>{e.preventDefault(); alert('Message sent (demo)')}}>
          <label className="block mb-2 text-sm">Your name</label>
          <input className="w-full border p-2 rounded mb-3" />

          <label className="block mb-2 text-sm">Email</label>
          <input className="w-full border p-2 rounded mb-3" />

          <label className="block mb-2 text-sm">Message</label>
          <textarea className="w-full border p-2 rounded mb-3" rows="4" />

          <button className="btn-primary px-4 py-2 rounded text-white">Send</button>
        </form>
      </div>
    </main>
  )
}
