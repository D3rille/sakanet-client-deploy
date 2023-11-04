import { gql } from '@apollo/client';


//Just copy paste from apollo playground
export const ADD_TO_CART = gql`
    mutation AddToCart($order: OrderInput) {
        addToCart(order: $order)
    }
 `;

export const GET_CART_ITEMS = gql`
    query GetCartItems {
        getCartItems {
        _id
        type
        createdAt
        buyer {
            id
            name
        }
        seller {
            id
            name
        }
        unit
        productId
        quantity
        status
        buyerResponse
        modeOfPayment
        modeOfDelivery
        deliveryAddress
        phoneNumber
        sellerResponse
        marketProductName
        price
        totalPrice
        accomplishedAt
        photo
        }
  }
`;

export const CHECKOUT_CART =gql`
    mutation Checkout($cartItems: [CheckOutInput]) {
        checkout(cartItems: $cartItems)
    }
`;  

export const DELETE_CARTITEM = gql`
    mutation DeleteCartItem($cartItemId: String) {
    deleteCartItem(cartItemId: $cartItemId)
    }
`;

