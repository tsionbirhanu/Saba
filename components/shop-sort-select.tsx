"use client";

type ShopSortSelectProps = {
  name?: string;
  defaultValue: string;
  className?: string;
};

export function ShopSortSelect({ name = "sort", defaultValue, className }: ShopSortSelectProps) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className={className}
      aria-label="Sort products"
    >
      <option value="newest">Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="popular">Most Popular</option>
    </select>
  );
}
