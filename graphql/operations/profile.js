import { gql } from '@apollo/client';

export const GET_MY_PROFILE = gql`
  query GetMyProfile {
  getMyProfile {
    connections
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
      verification_photo
      verification_status
      lastOpenedConvo
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
      payment_channels {
        _id
        channel
        details
      }
    }
  }
}
`;
