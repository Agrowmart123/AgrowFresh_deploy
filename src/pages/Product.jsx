import React from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function Product(){
  const { productId } = useParams()
  // sample product details
  const product = { id: productId, name: 'Demo Product', price: 99, image: IMAGES.product1, shopId: 's1', description: 'This is a demo product.' }

  return (
    <div>
      <main className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-4 rounded">
            <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded" />
            <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
            <div className="mt-4 font-bold text-xl">₹{product.price}</div>
            <div className="mt-4"><ProductCard product={product} /></div>
+          </div>
+          <aside className="bg-white p-4 rounded">
+            <h3 className="font-semibold">Related</h3>
+            <div className="mt-2 grid grid-cols-1 gap-2">
+              {Array.from({length:3}).map((_,i)=> <ProductCard key={i} product={{id:`rel-${i}`, name:`Related ${i+1}`, price:50+i*10, shopId:'s1'}} />)}
+            </div>
+          </aside>
+        </div>
+      </main>
+    </div>
+  )
+}
