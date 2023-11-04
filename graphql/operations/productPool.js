import {gql} from '@apollo/client';

export const GET_PRODUCT_POOLS = gql`
query GetProductPools($poolGroupId: String, $limit: Int, $cursor: String, $status: String) {
  getProductPools(poolGroupId: $poolGroupId, limit: $limit, cursor: $cursor, status: $status) {
    hasNextPage
    endCursor
    productPools {
      _id
      product {
        id
        englishName
        tagalogName
        photo
        product_type
      }
      poolGroup
      price
      status
      description
      stocks_capacity
      stocks_contributed
      unit
      minimum_stocks
      until
      collectionDate
      contributor_count
      modeOfCollection
      deletable
      createdAt
      editedAt
      dropOffLocation
      myContribution
    }
  }
}
`;

export const GET_CONTRIBUTORS = gql`
query GetContributors($productPoolId: String, $cursor: String, $limit: Int) {
  getContributors(productPoolId: $productPoolId, cursor: $cursor, limit: $limit) {
    hasNextPage
    poolContributors {
      _id
      poolId
      contributorId
      stock_added
      createdAt
      totalCompensation
      email
      phone
      profile_pic
      username
    }
  }
}
`;

export const GET_MARKETPRODUCT_OPTIONS = gql`
query GetMarketProductOptions {
  getMarketProductOptions {
    _id
    name
    units
  }
}
`;

export const CREATE_PRODUCT_POOL = gql`
mutation CreateProductPool($productPoolInput: CreateProdPoolInput) {
  createProductPool(productPoolInput: $productPoolInput) {
    _id
    product {
      id
      englishName
      tagalogName
      photo
      product_type
    }
    poolGroup
    price
    status
    description
    stocks_capacity
    stocks_contributed
    unit
    minimum_stocks
    until
    collectionDate
    contributor_count
    modeOfCollection
    deletable
    createdAt
    editedAt
    dropOffLocation
    myContribution
  }
}
`;

export const DELETE_PRODUCT_POOL = gql`
mutation DeleteProductPool($productPoolId: String) {
  deleteProductPool(productPoolId: $productPoolId)
}
`;

export const ADD_STOCKS = gql`
mutation AddStock($quantity: Float, $productPoolId: String) {
  addStock(quantity: $quantity, productPoolId: $productPoolId) {
    _id
    poolId
    contributorId
    stock_added
    createdAt
    totalCompensation
    email
    phone
    profile_pic
    username
  }
}
`;

export const DELETE_CONTRIBUTION = gql`
mutation DeleteContribution($poolId: String) {
  deleteContribution(poolId: $poolId)
}
`;