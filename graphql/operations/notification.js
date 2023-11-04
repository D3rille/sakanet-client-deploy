import {gql} from '@apollo/client';

export const READ_ALL_NOTIF= gql`
  mutation Mutation {
    readAllNotifications
    }
`;

export const DELETE_NOTIFICATION= gql`
  mutation DeleteNotification($notificationId: String) {
  deleteNotification(notificationId: $notificationId)
}
`;

export const CLEAR_NOTIFICATIONS=gql`
  mutation Mutation {
    clearNotifications
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    getNotifications {
      _id
      receiverId
      from
      photo
      type
      message
      createdAt
      read
    }
  }
  `;

export const NOTIF_SUB = gql`
  subscription NewNotification($receiverId: String) {
    newNotification(receiverId: $receiverId) {
      _id
      receiverId
      photo
      from
      type
      message
      createdAt
      read
    }
  }
`;

 export const CREATE_POST = gql`
    mutation CreatePost($body: String!) {
      createPost(body: $body) {
        id
        body
        createdAt
        author
        username
      }
    }
    `;

