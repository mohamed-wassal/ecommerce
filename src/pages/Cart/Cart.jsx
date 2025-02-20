import axios from "axios";
import React, { useEffect, useState } from "react";
import CartProduct from "../../components/CartProduct/CartProduct";
import { formatCurrency } from "../../Helpers/currencyHelper";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [isLoading, setIsLoading] = useState(true);
  const [cartId, setCartId] = useState(null);
  const [numOfCartItems, setNumOfCartItems] = useState(0);
  const [cartData, setCartData] = useState(null);
  const [clearCartLoading, setClearCartLoading] = useState(false);

  useEffect(() => {
    getUserCart();
  }, []);

  async function getUserCart() {
    setIsLoading(true);
    const { data } = await axios.get(
      "https://ecommerce.routemisr.com/api/v1/cart",
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    setIsLoading(false);

    setCartId(data.cartId);
    setNumOfCartItems(data.numOfCartItems);
    setCartData(data.data);
  }

  async function removeSpecificCartItem(productId, setIsLoading) {
    setIsLoading(true);
    const { data } = await axios.delete(
      "https://ecommerce.routemisr.com/api/v1/cart/" + productId,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    setIsLoading(false);

    setCartData(data.data);
    setCartId(data.cartId);
    setNumOfCartItems(data.numOfCartItems);
  }

  async function clearCart() {
    setClearCartLoading(true);
    const { data } = await axios.delete(
      "https://ecommerce.routemisr.com/api/v1/cart ",
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    setClearCartLoading(false);
    setCartData(null);
    setCartId(null);
    setNumOfCartItems(0);
  }

  async function updateProductCount(
    productId,
    count,
    setDecrementIsLoading,
    setIncrementIsLoading,
    currentCount
  ) {
    if (count > currentCount) {
      setDecrementIsLoading(true);
    }
    if (count < currentCount) {
      setIncrementIsLoading(true);
    }

    const { data } = await axios.put(
      "https://ecommerce.routemisr.com/api/v1/cart/" + productId,
      {
        count,
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    setCartData(data.data);
    setCartId(data.cartId);
    setNumOfCartItems(data.numOfCartItems);
    setDecrementIsLoading(false);
    setIncrementIsLoading(false);
  }

  

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (numOfCartItems == 0) {
    return (
      <h1 className="text-center text-4xl font-bold py-10">
        No Products In Your Cart
      </h1>
    );
  }

  return (
    <>
      <div className="flex justify-between">
        <h1 className="mb-10 text-center text-2xl font-bold">
          Cart Items ({numOfCartItems})
        </h1>
        <Button
          isLoading={clearCartLoading}
          variant="bordered"
          color="danger"
          onPress={clearCart}
        >
          Clear
        </Button>
      </div>
      <div className="justify-center px-6 md:flex md:space-x-6 xl:px-0">
        <div className="rounded-lg md:w-2/3">
          {cartData?.products.map((product, index) => {
            return (
              <CartProduct
                key={index}
                product={product}
                removeSpecificCartItem={removeSpecificCartItem}
                updateProductCount={updateProductCount}
              />
            );
          })}
        </div>
        {/* Sub total */}
        <div className=" sticky top-20 mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
          <div className="mb-2 flex justify-between">
            <p className="text-gray-700">Subtotal</p>
            <p className="text-gray-700">
              {formatCurrency(cartData?.totalCartPrice)}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Shipping</p>
            <p className="text-gray-700">$4.99</p>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between">
            <p className="text-lg font-bold">Total</p>
            <div>
              <p className="mb-1 text-lg font-bold">
                {formatCurrency(cartData?.totalCartPrice + 4.99)}
              </p>
              <p className="text-sm text-gray-700">including VAT</p>
            </div>
          </div>
          <Link
          to={"/address/"+cartId}
            className="mt-6 w-full block text-center rounded-md bg-blue-500 py-2 px-2 font-medium text-blue-50 hover:bg-blue-600"
          >
            Check out
          </Link>
        </div>
      </div>
    </>
  );
}
