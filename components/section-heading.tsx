type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-4xl text-ink sm:text-5xl">{title}</h2>
        <p className="mt-4 body-copy">{description}</p>
      </div>
      {action}
    </div>
  );
}
