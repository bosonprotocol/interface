import React, { cloneElement, ReactElement } from "react";

interface PassDownPropsProps {
  children: ReactElement | ReactElement[];
}

const PassDownProps: React.FC<PassDownPropsProps> = ({ children, ...rest }) => {
  return (
    <>
      {React.Children.map(children, (child) =>
        cloneElement(child, { ...rest })
      )}
    </>
  );
};

export default PassDownProps;
