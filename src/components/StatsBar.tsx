const stats = [
  { value: "80%", label: "Queries Automated" },
  { value: "24/7", label: "Always Available" },
  { value: "80+", label: "Languages" },
  { value: "<2s", label: "Response Time" },
];

const StatsBar = () => {
  return (
    <section className="py-16 px-6">
      <div className="container max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-4xl md:text-5xl font-bold text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
