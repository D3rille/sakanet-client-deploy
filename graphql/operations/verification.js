import { gql } from '@apollo/client';


export const UPLOAD_VERIFICATION_PHOTO = gql`
mutation UploadVerificationPhoto($verification_photo: String!) {
  uploadVerificationPhoto(verification_photo: $verification_photo)
}
`;


export const UPDATE_VERIFICATION_STATUS = gql`
mutation UpdateVerificationStatus($verification_status: String!) {
  updateVerificationStatus(verification_status: $verification_status)
}
`;

export const UPLOAD_NAME_AND_BIRTHDATE = gql`
mutation UploadNameAndBirthdate($firstName: String, $lastName: String, $middleName: String, $birthDate: String) {
  uploadNameAndBirthdate(firstName: $firstName, lastName: $lastName, middleName: $middleName, birthDate: $birthDate)
}
`;

