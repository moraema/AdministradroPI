import React from 'react';
import { Button } from 'react-bootstrap';

const Boton = ({ className, children }) => {
  return <Button className={className}>{children}</Button>;
};

export default Boton;
