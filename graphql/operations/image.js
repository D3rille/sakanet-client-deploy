import { gql } from '@apollo/client';


export const UPLOAD_PROFILE_PIC = gql`
  mutation UploadProfilePic($profile_pic: String!) {
    updateProfilePic(profile_pic: $profile_pic)
  }
`;


export const UPLOAD_COVER_PIC = gql`
  mutation UploadCoverPic($cover_photo: String!) {
    updateCoverPic(cover_photo: $cover_photo)
  }
`;
