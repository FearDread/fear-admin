
// Featured Products Section
const FeaturedProducts = () => {
  const products = [
    { id: 1, name: "Men White T-Shirt", category: "Fashion", price: 49, rating: 5, icon: "👕" },
    { id: 2, name: "Puma Sports Shoes", category: "Sports", price: 49, rating: 4, icon: "👟" },
    { id: 3, name: "Women Red Sneakers", category: "Fashion", price: 49, rating: 4, icon: "👠" },
    { id: 4, name: "Black Headphone", category: "Electronics", price: 49, rating: 5, icon: "🎧" },
    { id: 5, name: "Smart Watch", category: "Electronics", price: 49, rating: 4, icon: "⌚" },
    { id: 6, name: "Laptop Bag", category: "Accessories", price: 49, rating: 5, icon: "💼" },
    { id: 7, name: "Sunglasses", category: "Accessories", price: 49, rating: 4, icon: "🕶️" },
    { id: 8, name: "Blue Girl Shoes", category: "Fashion", price: 49, rating: 5, icon: "👡" }
  ];

  return (
    <section className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h5 className="text-2xl font-bold">FEATURED PRODUCTS</h5>
          <button className="text-sm hover:text-gray-300 flex items-center gap-1">
            More Products <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;