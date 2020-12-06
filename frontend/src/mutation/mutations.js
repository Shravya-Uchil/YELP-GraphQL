import { gql } from 'apollo-boost';

const customerSignupMutation = gql`
  mutation customerSignup(
    $cust_name: String
    $email_id: String
    $password: String
  ) {
    customerSignup(
      cust_name: $cust_name
      email_id: $email_id
      password: $password
    ) {
      message
      status
    }
  }
`;

/*const restaurantSignup = gql`
    mutation restaurantSignup($name: String, $email: String, $password: String, $location: String){
        addCompany(name: $name, email: $email, password: $password, location: $location){
            message
            status
        }
    }
`;*/

const loginMutation = gql`
  mutation login($email_id: String, $password: String, $login_type: String) {
    login(email_id: $email_id, password: $password, login_type: $login_type) {
      message
      status
    }
  }
`;

export { customerSignupMutation, loginMutation };
