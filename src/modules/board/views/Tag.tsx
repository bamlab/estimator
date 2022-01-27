import React from "react";

type Props = {
  title: string;
  color?: string;
  bgcolor?: string;
  tagStyle?: object;
};

export const Tag = ({
  title,
  color,
  bgcolor,
  tagStyle,
  ...otherProps
}: Props) => {
  const style = {
    color: color || "white",
    backgroundColor: bgcolor || "orange",
    ...tagStyle,
  };
  return (
    <span style={style} {...otherProps}>
      {title}
    </span>
  );
};
