import React from 'react';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderTop: '1px solid #e0e0e0',
    color: '#333333',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };

  const sectionStyle = {
    marginBottom: '10px',
  };

  const headingStyle = {
    marginTop: 0,
    marginBottom: '10px',
    fontWeight: 600,
  };

  const textStyle = {
    margin: 0,
    lineHeight: 1.5,
  };

  const copyrightStyle = {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '0.8rem',
    color: '#666666',
  };

  return (
    <footer style={footerStyle}>
      
      
      <div style={copyrightStyle}>
        &copy; {new Date().getFullYear()} FoodHero. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;