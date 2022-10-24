
import { Link, useParams, Outlet, useLocation } from "react-router-dom";

const formatPhoneNumber = (phoneNumberString) => {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      var intlCode = (match[1] ? '+1 ' : '');
      return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    
    return null;
  }

const CustomerDetails = () => {
    const { customerId } = useParams();

    console.log('customerId', customerId)

    return (
        <div>Customer Details</div>
        
    )
}

export default CustomerDetails;