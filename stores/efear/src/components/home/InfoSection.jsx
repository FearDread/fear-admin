

// Info Section Component
const InfoSection = () => {
  const info = [
    { icon: "🚚", title: "FREE SHIPPING & RETURN", desc: "Free shipping on all orders over $49" },
    { icon: "💰", title: "MONEY BACK GUARANTEE", desc: "100% money back guarantee" },
    { icon: "🎧", title: "ONLINE SUPPORT 24/7", desc: "Awesome Support for 24/7 Days" }
  ];

  return (
    <div className="border-y border-gray-700 py-8 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {info.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="text-5xl">{item.icon}</div>
              <div>
                <h6 className="font-semibold mb-1">{item.title}</h6>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoSection;