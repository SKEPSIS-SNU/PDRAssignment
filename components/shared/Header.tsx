import React from "react";

const Header = ({
  heading,
  description,
}: {
  heading: string;
  description?: string;
}) => {
  return (
    <header className="py-6">
      <h1 className="text-3xl font-semibold">{heading}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </header>
  );
};

export default Header;
