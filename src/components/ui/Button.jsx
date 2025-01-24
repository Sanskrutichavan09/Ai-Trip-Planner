/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

const Button = React.forwardRef(
  ({ asChild = false, variant = "default", size = "default", style = {}, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // Variant styles
    const variantStyles = {
      default: {
        backgroundColor: "#007BFF", // Replace with your primary color
        color: "#FFFFFF",
        hover: { backgroundColor: "#0056b3" }, // Hover variant
      },
      destructive: {
        backgroundColor: "#DC3545", // Destructive color
        color: "#FFFFFF",
        hover: { backgroundColor: "#C82333" },
      },
      outline: {
        backgroundColor: "transparent",
        border: "1px solid #CED4DA", // Light border
        color: "#495057",
        hover: { backgroundColor: "#E9ECEF", color: "#212529" },
      },
      secondary: {
        backgroundColor: "#6C757D",
        color: "#FFFFFF",
        hover: { backgroundColor: "#5A6268" },
      },
      ghost: {
        backgroundColor: "transparent",
        color: "#6C757D",
        hover: { backgroundColor: "#E9ECEF", color: "#495057" },
      },
      link: {
        backgroundColor: "transparent",
        color: "#007BFF",
        textDecoration: "underline",
        hover: { textDecoration: "none" },
      },
    };

    // Size styles
    const sizeStyles = {
      default: {
        height: "2.5rem", // 10 in rem
        padding: "0.5rem 1rem",
        borderRadius: "0.375rem",
      },
      sm: {
        height: "2.25rem", // 9 in rem
        padding: "0.375rem 0.75rem",
        borderRadius: "0.375rem",
      },
      lg: {
        height: "2.75rem", // 11 in rem
        padding: "0.625rem 1.25rem",
        borderRadius: "0.5rem",
      },
      icon: {
        height: "2.5rem", // Same height
        width: "2.5rem",
        padding: "0",
        borderRadius: "50%",
      },
    };

    const combinedStyles = {
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style, // Merge custom inline styles
    };

    return (
      <Comp
        ref={ref}
        style={combinedStyles}
        onMouseOver={(e) => {
          if (variantStyles[variant].hover) {
            Object.assign(e.target.style, variantStyles[variant].hover);
          }
        }}
        onMouseOut={(e) => {
          Object.assign(e.target.style, variantStyles[variant]);
        }}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
