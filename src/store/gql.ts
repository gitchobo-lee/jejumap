import { gql } from "@apollo/client";
export const FETCH_ALL_POLYGONS = gql`
  query {
    allPolygon {
      polygons
    }
  }
`;
export const FETCH_ALL_ADDRESS_AND_CHECK = gql`
  query {
    allAddressAndCheck {
      address
      check
      comment
      polygon
    }
  }
`;

export const UPDATE_ADDRESS_AND_CHECK = gql`
  mutation ($address: String!, $polygon: [[Float!]!]!) {
    postAddress(address: $address, polygon: $polygon) {
      address
      check
      comment
      polygon
    }
  }
`;

export const UPDATE_COMMENT_CHECK = gql`
  mutation ($address: String!, $comment: String) {
    postWithCheck(address: $address, comment: $comment) {
      address
      check
      comment
      polygon
    }
  }
`;

export const UPDATE_COMMENT_ONLY = gql`
  mutation ($address: String!, $comment: String) {
    postOnlyComment(address: $address, comment: $comment) {
      address
      check
      comment
      polygon
    }
  }
`;

export const UPDATE_COMMENT_CANCEL = gql`
  mutation ($address: String!, $comment: String) {
    postCancel(address: $address, comment: $comment) {
      address
      check
      comment
      polygon
    }
  }
`;
