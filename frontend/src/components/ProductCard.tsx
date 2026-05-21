import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { formatPrice, price, productImage } from '../lib/products';
import type { ProductType } from '../lib/products';

interface ProductCardProps {
  product: ProductType;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const image = productImage(product);
  const hasDiscount = Boolean(product.discount_price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)
    : 0;

  return (
    <Link to={`/product/${product.slug}`} className="group block h-full">
      <article className="h-full overflow-hidden rounded-lg border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-black/5">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-secondary">No image</div>
          )}
          {product.tag && (
            <span className="absolute left-3 top-3 rounded bg-accent px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-background">
              {product.tag}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="absolute right-3 top-3 rounded bg-sale px-2 py-1 text-[11px] font-semibold text-background">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className={`${compact ? 'p-3' : 'p-4'} flex min-h-[168px] flex-col`}>
          <div className="mb-2 flex items-center justify-between gap-3 text-xs text-secondary">
            <span className="truncate uppercase tracking-wide">{product.category.name}</span>
            <span className="flex shrink-0 items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              {Number(product.rating).toFixed(1)}
            </span>
          </div>

          <h3 className="line-clamp-2 min-h-[44px] text-sm font-semibold leading-5 text-primary">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-secondary">{product.description}</p>

          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            <div className="min-w-0">
              {hasDiscount && (
                <p className="text-xs text-secondary line-through">{formatPrice(product.price)}</p>
              )}
              <p className="text-base font-bold text-primary">{formatPrice(price(product))}</p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-background transition-colors group-hover:bg-accent">
              <ShoppingBag className="h-4 w-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
