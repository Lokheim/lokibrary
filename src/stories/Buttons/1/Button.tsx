import React from "react";

type ButtonProps = React.ComponentProps<"button"> &
  React.CSSProperties & {
    Title?: string;
    className?: string;
  };

export const Button = ({
  borderRadius,
  Title,
  children,
  outline,
  outlineColor,
  padding,
  outlineWidth,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      style={{
        padding: padding ?? "10px",
        borderRadius: borderRadius ?? 18,
        outline: outline ?? "solid",
        outlineWidth: outlineWidth ?? 1,
        outlineColor: outlineColor ?? "#dddddd",
      }}
      className={className}
    >
      {Title ? Title : "Button"}
      <>{children}</>
    </button>
  );
};
