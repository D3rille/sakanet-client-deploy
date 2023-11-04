import {gql} from '@apollo/client';

export const SEARCH_USERS = gql`
    query SearchUsers($searchInput: String) {
        searchUsers(searchInput: $searchInput) {
            _id
            username
            profile_pic
            role
            address {
                street
                barangay
                cityOrMunicipality
                province
                region
            }
        }
    }
`;

export const GO_TO_PROFILE = gql`
query GoToProfile($userId: String) {
  goToProfile(userId: $userId) {
    profile {
      _id
      profile_pic
      firstName
      lastName
      displayName
      description
      date_joined
      cover_photo
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
      ratingStatistics {
        oneStar
        twoStar
        threeStar
        fourStar
        fiveStar
        totalStars
        lastStarRating
        reviewerCount
      }
      joined_group
      managed_group
    }
    connectionStatus
    connections
  }
}
`;
