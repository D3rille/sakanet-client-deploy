import { gql } from '@apollo/client';


//Just copy paste from apollo playground
export const GET_MANAGED_GROUPS = gql`
    query GetManagedGroups {
        getManagedGroups {
            groupName
            profile_pic
            _id
        }
    }
`;

export const GET_JOINED_GROUPS = gql`
    query GetJoinedGroups {
        getJoinedGroups {
            profile_pic
            groupName
            _id
        }
    }
`;

export const GET_SUGGESTED_GROUPS = gql`
    query GetSuggestedGroups {
        getSuggestedGroups {
            _id
            groupName
            profile_pic
            cover_photo
        }
    }
`;

export const GET_POOL_GROUP_INFO = gql`
    query GetPoolGroupInfo($poolGroupId: String) {
        getPoolGroupInfo(poolGroupId: $poolGroupId) {
            _id
            groupName
            groupDescription
            applications
            membersList
            creator
            admins
            profile_pic
            cover_photo
            createdAt
            membersCount
        }
    }
`;

export const GET_POOL_GROUP_APPLICATIONS = gql`
    query GetPoolGroupApplications($poolGroupId: String) {
        getPoolGroupApplications(poolGroupId: $poolGroupId) {
            _id
            username
            profile_pic
            address {
            street
            barangay
            cityOrMunicipality
            province
            region
            }
            is_verified
            rating
            role
        }
    }
`;

export const GET_POOL_GROUP_MEMBERS = gql`
    query GetPoolGroupMembers($poolGroupId: String, $cursor: String, $limit: Int) {
        getPoolGroupMembers(poolGroupId: $poolGroupId, cursor: $cursor, limit: $limit) {
            endCursor
            hasNextPage
            members {
            _id
            address {
                province
                barangay
                cityOrMunicipality
                region
                street
            }
            profile_pic
            username
            }
        }
    }
`;

export const CREATE_POOL_GROUP  = gql`
    mutation CreatePoolGroup($groupName: String, $groupDescription: String) {
        createPoolGroup(groupName: $groupName, groupDescription: $groupDescription)
    }
`;

export const JOIN_POOL_GROUP = gql`
    mutation JoinPoolGroup($poolGroupId: String) {
    joinPoolGroup(poolGroupId: $poolGroupId)
    }
`;

export const CONFIG_POOL_GROUP_INFO = gql`
    mutation ConfigPoolGroupInfo($poolGroupId: String, $poolGroupConfigInput: PoolGroupConfigInput) {
        configPoolGroupInfo(poolGroupId: $poolGroupId, poolGroupConfigInput: $poolGroupConfigInput)
    }
`;

export const ACCEPT_JOIN_APPLICATION = gql`
    mutation AcceptJoinApplication($poolGroupId: String, $userId: String) {
        acceptJoinApplication(poolGroupId: $poolGroupId, userId: $userId)
    }
`;

export const DECLINE_JOIN_APPLICATION = gql`
    mutation DeclineJoinApplication($poolGroupId: String, $userId: String) {
        declineJoinApplication(poolGroupId: $poolGroupId, userId: $userId)
    }
`;

export const PROMOTE_TO_ADMIN = gql`
    mutation PromoteToAdmin($userId: String, $poolGroupId: String) {
        promoteToAdmin(userId: $userId, poolGroupId: $poolGroupId)
    }
`;

export const REMOVE_FROM_POOL_GROUP = gql`
    mutation RemoveFromPoolGroup($userId: String, $poolGroupId: String) {
        removeFromPoolGroup(userId: $userId, poolGroupId: $poolGroupId)
    }
`;

export const DEMOTE_ADMIN = gql`
    mutation DemoteAdmin($userId: String, $poolGroupId: String) {
        demoteAdmin(userId: $userId, poolGroupId: $poolGroupId)
    }
`;

export const LEAVE_POOL_GROUP = gql`
mutation LeavePoolGroup($poolGroupId: String) {
  leavePoolGroup(poolGroupId: $poolGroupId)
}
`;

export const DELETE_POOL_GROUP = gql`
mutation DeletePoolGroup($poolGroupId: String, $confirmation: String) {
  deletePoolGroup(poolGroupId: $poolGroupId, confirmation: $confirmation)
}
`;

export const POOL_GROUP_APPLICATIONS_SUB = gql`
subscription NewPoolGroupApplication($poolGroupId: String, $isAdmin: Boolean) {
  newPoolGroupApplication(poolGroupId: $poolGroupId, isAdmin: $isAdmin) {
    poolGroupId
    profile {
      _id
      username
      profile_pic
      address {
        barangay
        cityOrMunicipality
        province
        region
        street
      }
      is_verified
      rating
    }
  }
}
`;


