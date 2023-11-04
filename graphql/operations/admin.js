import { gql } from '@apollo/client';


//Just copy paste from apollo playground
export const GET_USER_INFO = gql`
   query GetUserInfo($searchInput: String) {    
        getUserInfo(searchInput: $searchInput) {
            _id
            profile_pic
            firstName
            lastName
            displayName
            description
            date_joined
            username
            address {
            street
            barangay
            cityOrMunicipality
            province
            region
            }
            account_email
            account_mobile
            emails
            mobile_nums
            is_verified
            role
            rating
            cover_photo
            verification_photo
            verification_status
        }
    }
`;

export const VERIFY_USER  = gql`
    mutation VerifyUser($userId: String) {
        verifyUser(userId: $userId)
    }
`;

export const UNVERIFY_USER  = gql`
    mutation UnverifyUser($userId: String) {
        unverifyUser(userId: $userId)
    }
`;

export const REJECT_VERIFICATION = gql`
mutation RejectVerification($userId: String) {
  rejectVerification(userId: $userId)
}
`;