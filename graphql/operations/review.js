import { gql } from '@apollo/client';


//Just copy paste from apollo playground
export const GET_ALL_REVIEWS = gql`
    query GetAllReviews($subjectedUser: String) {
        getAllReviews(subjectedUser: $subjectedUser) {
            _id
            reviewerId
            username
            profile_pic
            subjectedUser
            rate
            comment
            date
            edited
        }
    }
 `;
 
 export const CHECK_PERMISSION = gql`
    query Query {
        checkPermissionToReview
    }
 `;

 export const GET_MY_REVIEW = gql`
    query GetMyReview($subjectedUser: String) {
        getMyReview(subjectedUser: $subjectedUser) {
            _id
            reviewerId
            username
            profile_pic
            subjectedUser
            rate
            comment
            date
            edited
        }
    }
 `;
 export const WRITE_REVIEW = gql`
    mutation WriteReview($reviewInput: ReviewInput) {
        writeReview(reviewInput: $reviewInput) {
            _id
            reviewerId
            username
            profile_pic
            subjectedUser
            rate
            comment
            date
            edited
        }
    }
 `;

 export const EDIT_REVIEW = gql`
    mutation EditReview($reviewId: String, $rate: Float, $comment: String) {
        editReview(reviewId: $reviewId, rate: $rate, comment: $comment)
    }
 `;


