/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import * as React from "react";

const Input = React.forwardRef(({ className, type = "text", style = {}, ...props }, ref) => {
  const defaultStyles = {
    display: "flex",
    height: "2.5rem", // 10 rem
    width: "100%",
    borderRadius: "0.375rem", // Rounded corners
    border: "1px solid #CED4DA", // Light border
    backgroundColor: "#FFFFFF", // Input background
    padding: "0.5rem 0.75rem", // Padding
    fontSize: "1rem", // Base font size
    color: "#495057", // Default text color
    outline: "none",
    transition: "all 0.2s ease", // Smooth transition for focus
  };

  const focusStyles = {
    outline: "2px solid #007BFF", // Ring color on focus
    outlineOffset: "2px",
  };

  const disabledStyles = {
    cursor: "not-allowed",
    opacity: 0.5,
  };

  const placeholderStyles = {
    color: "#6C757D", // Muted placeholder color
  };

  return (
    <input
      type={type}
      style={{
        ...defaultStyles,
        ...(props.disabled ? disabledStyles : {}),
        ...style,
      }}
      onFocus={(e) => Object.assign(e.target.style, focusStyles)}
      onBlur={(e) => Object.assign(e.target.style, defaultStyles)}
      placeholderStyle={placeholderStyles} // Placeholder color
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
