import gql from 'graphql-tag'

/* registerCompany Mutation */
export const REGISTER_COMPANY = gql`
  mutation(
    $companyLegalName: String!
    $companyIdentification: String!
    $city: String!
    $businessTypes: [Int!]!
    $personFirstName: String!
    $personLastName: String!
    $personIdentification: String!
    $userEmail: String!
    $userPassword: String!
  ) {
    register: registerCompany(
      input: {
        company_legal_name: $companyLegalName
        company_identification: $companyIdentification
        city: $city
        business_types: $businessTypes
        person_first_name: $personFirstName
        person_last_name: $personLastName
        person_identification: $personIdentification
        user_email: $userEmail
        user_password: $userPassword
      }
    ) {
      token {
        access_token
        token_type
        expires_in
        refresh_token
      }
      me {
        user_id
        email
        person {
          person_id
          person_first_name
          person_last_name
          person_legal_name
          person_full_name
          person_identification
          person_description
        }
        profile {
          profile_id
          profile_machine_name
          profile_name
          menus {
            menu_id
            menu_name
            menu_uri
            menu_icon
            menu_order
            sub_menus {
              menu_id
              menu_name
              menu_uri
              menu_icon
              menu_order
            }
          }
        }
      }
      company {
        company_id
        company_legal_name
        company_commercial_name
        company_identification
        company_slug
        company_image_name
        company_image_mini
        company_image_medium
        city
        company_is_certified
        offices {
          office_id
          office_name
          office_email
          office_open_from
          office_open_to
          office_delivery_time
          office_minimum_order_price
          city
          business_types {
            business_type_id
            business_type_machine_name
            business_type_normalized_name
            business_type_name
          }
          users {
            user_id
            email
            person {
              person_id
              person_first_name
              person_last_name
              person_legal_name
              person_full_name
              person_identification
              person_description
            }
            profile {
              profile_id
              profile_machine_name
              profile_name
            }
          }
        }
      }
    }
  }
`

/* updateCompany Mutation */
export const UPDATE_COMPANY = gql`
  mutation(
    $companyId: ID!
    $companyLegalName: String!
    $companyCommercialName: String
    $companyIdentification: String
    $companyImage: Upload
    $city: String!
    $officeId: ID!
    $officeEmail: String
    $officeOpenFrom: String
    $officeOpenTo: String
    $officeDeliveryTime: String
    $officeMinimumOrderPrice: Float
    $businessTypes: [Int!]!
  ) {
    company: updateCompany(
      input: {
        id: $companyId
        company_legal_name: $companyLegalName
        company_commercial_name: $companyCommercialName
        company_identification: $companyIdentification
        company_image: $companyImage
        city: $city
        office_id: $officeId
        office_email: $officeEmail
        office_open_from: $officeOpenFrom
        office_open_to: $officeOpenTo
        office_delivery_time: $officeDeliveryTime
        office_minimum_order_price: $officeMinimumOrderPrice
        business_types: $businessTypes
      }
    ) {
      company_id
      company_legal_name
      company_commercial_name
      company_identification
      company_slug
      company_image_name
      company_image_mini
      company_image_medium
      city
      company_is_certified
      offices {
        office_id
        office_name
        office_email
        office_open_from
        office_open_to
        office_delivery_time
        office_minimum_order_price
        city
        business_types {
          business_type_id
          business_type_machine_name
          business_type_normalized_name
          business_type_name
        }
        users {
          user_id
          email
          person {
            person_id
            person_first_name
            person_last_name
            person_legal_name
            person_full_name
            person_identification
            person_description
          }
          profile {
            profile_id
            profile_machine_name
            profile_name
          }
        }
      }
    }
  }
`