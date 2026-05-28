import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Box } from 'lucide-react';
import { price, productImage, formatPrice } from '../lib/products';

export default function Cart() {
  const { items, totalCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <div className="w-24 h-24 bg-surface border border-border rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-secondary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-3">Your cart is empty</h2>
        <p className="text-secondary mb-8">Browse products and add what you need.</p>
        <Link
          to="/products"
          className="bg-accent text-background px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const shipping = 150;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Cart <span className="text-secondary text-lg font-normal">({totalCount} {totalCount === 1 ? 'item' : 'items'})</span>
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="lg:w-2/3 space-y-6">
          <AnimatePresence initial={false}>
            {items.map(({ product, quantity }) => {
              const image = productImage(product);
              const itemTotal = price(product) * quantity;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25 }}
                  className="bg-surface border border-border rounded-2xl p-6 flex flex-col md:flex-row gap-6 relative group overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-background border border-border rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {image ? (
                      <img src={image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <Box className="w-10 h-10 text-secondary/30" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-accent uppercase tracking-wider font-bold mb-1">
                          {product.brand?.name || 'Dukan'}
                        </p>
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <p className="text-sm text-secondary">{product.category?.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-secondary hover:text-red-400 p-2 rounded-lg hover:bg-background transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between">
                      <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-secondary hover:text-primary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-lg font-bold">{formatPrice(itemTotal)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-surface border border-border rounded-2xl p-6 sticky top-28">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Shipping estimate</span>
                <span className="font-medium">{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Tax</span>
                <span className="font-medium text-secondary">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-accent">{formatPrice(totalPrice + shipping)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full bg-accent text-background font-semibold py-4 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
