import {gql} from '@apollo/client';

//Just copy paste from apollo playground
export const GET_ORDERS = gql`
    query GetOrders($status: String, $limit: Int, $cursor: String) {
    getOrders(status: $status, limit: $limit, cursor: $cursor) {
        endCursor
        hasNextPage
        orders {
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
    }
 `;

export const SELLER_HAS_PAYMENT_CHANNELS = gql`
query Query($sellerId: String) {
  sellerHasOnlinePaymentChannels(sellerId: $sellerId)
}
`;

export const UPDATE_STATUS = gql`
    mutation UpdateStatus($orderId: String) {
        updateStatus(orderId: $orderId)
    }
`;

export const CANCEL_ORDER = gql`
    mutation CancelOrder($orderId: String) {
    cancelOrder(orderId: $orderId)
    }
`;
export const DECLINE_ORDER = gql`
    mutation DeclineOrder($orderId: String, $reason: String) {
        declineOrder(orderId: $orderId, reason: $reason)
    }
`;
export const PLACE_ORDER = gql`
    mutation PlaceOrder($order: OrderInput) {
        placeOrder(order: $order)
    }
`;

export const SEND_SELLER_PAYMENT_CHANNELS = gql`
mutation SendSellerPaymentChannels($buyerId: String) {
  sendSellerPaymentChannels(buyerId: $buyerId)
}
`;

export const RETURN_STOCK = gql`
mutation ReturnStock($orderId: String, $productId: String) {
  returnStock(orderId: $orderId, productId: $productId)
}
`;

