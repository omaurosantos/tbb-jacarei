interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <section className="bg-primary text-primary-foreground border-b-4 border-highlight py-12 md:py-16">
      <div className="container">
        <h1 className="font-display text-5xl md:text-6xl font-semibold leading-tight">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-xl text-primary-foreground/90 max-w-xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
