// AuthLayout.jsx
import React from "react";
import Footer from "../Footer/footer";

const AuthLayout = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
