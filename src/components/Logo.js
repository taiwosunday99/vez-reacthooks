import React from 'react';

const Logo = (props) => {
  return (
    <img
    height="50px"
    width= "75px"
      alt="Logo"
      src="/static/images/vezeti/vezeti-logo.png"
      {...props}
    />
  );
}

export default Logo;
