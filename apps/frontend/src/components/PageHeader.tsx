interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <section className="bg-primary text-primary-foreground border-b-4 border-highlight py-12 md:py-16">
      <div className="container">
        <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
