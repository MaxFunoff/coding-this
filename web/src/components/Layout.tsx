import React, { FC } from "react";
import { Wrapper, WrapperVariant } from "./Wrapper";
import { Navbar } from "./Navbar";


interface LayoutProps {
  variant?: WrapperVariant
}

export const Layout: FC<LayoutProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <>
        <Navbar/>
        <Wrapper variant={variant}>
            {children}
        </Wrapper>
    </>
  );
};
