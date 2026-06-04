import React, { useContext } from "react";
import { CartContext } from "../../Context/CartContext";
import EmptyCart from "../../components/EmptyCart/EmptyCart";
import FilledCart from "../../components/FilledCart/FilledCart";

const CartPage = () => {
  const { items } = useContext(CartContext);

  return items.length === 0 ? <EmptyCart /> : <FilledCart />;
};

export default CartPage;
