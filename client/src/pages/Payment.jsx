import { loadStripe } from "@stripe/stripe-js";
import logo from "../assets/logo.png";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51PQFJ7LbsJuXkwVqH30KUrt8lNCpzjg0bwal1iIg8zRBpKWfcEIXk65LcyU8T1e40dH1Dndvyma2a64E7HOcjlLM00xJTDFG7c"
);

const PaymentForm = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const handleSignOut = async (event) => {
    event.preventDefault();
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    navigate("/signup");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      const errorElement = document.getElementById("card-errors");
      errorElement.textContent = error.message;
    } else {
      const name = localStorage.getItem("name");
      const email = localStorage.getItem("email");
      const password = localStorage.getItem("password");
      const code = localStorage.getItem("code");
<<<<<<< HEAD
      if (code) {
=======
      if (code){
>>>>>>> f56e77bd24a7583db63b492fec45ae92f5d8b964
        const response = await fetch("https://cloud.dev/api/users/signup-git", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token.id,
<<<<<<< HEAD
            code: code,
          }),
        });
        localStorage.removeItem("code");

        if (response.status === 201) {
          navigate("/homepage");
        } else {
          navigate("/signup");
        }
        const data = await response.json();

        console.log(data);
      } else {
        const response = await fetch("https://cloud.dev/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token.id,
            name: name,
            email: email,
            password: password,
          }),
        });
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        if (response.status === 201) {
          navigate("/homepage");
        } else {
          navigate("/signup");
        }
      }
=======
            code: code
          }),
        });
        localStorage.removeItem("code");

        if (response.status === 201) {
          navigate("/homepage");
        }else {
          navigate("/signup");
        }
        const data = await response.json();

        console.log(data);
      }else {
        const response = await fetch("https://cloud.dev/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token.id,
            name: name,
            email: email,
            password: password,
          }),
        });
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        if (response.status === 201) {
          navigate("/homepage");
        }else {
          navigate("/signup");
        }
      }

>>>>>>> f56e77bd24a7583db63b492fec45ae92f5d8b964
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="navbar flex items-center justify-between bg-[#041b4d] p-6 text-white">
        <div className="title flex items-center text-2xl">
          <img src={logo} alt="Cloud Wave Logo" className="h-10 mr-3" />
          <span>Welcome to CloudWave</span>
        </div>
        <button
          onClick={handleSignOut}
          className="signout text-lg text-bold bg-gray-100 text-blue-600 py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>

      <div className="wrapper flex bg-white p-10 rounded-lg shadow-lg w-11/12 max-w-7xl mx-auto mt-10">
        <div className="info flex-1 text-left text-lg text-gray-700">
          <p className="mb-6">
            <strong>Verify your Payment Information</strong>
          </p>
          <p className="mb-6">
            We use this info to verify your identity, which allows us to keep
            DigitalOcean safe against spammers and bots.
          </p>
          <p>
            Youre billed based on usage, which means youre only billed for the
            services you actually use.
          </p>
        </div>

        <div className="container flex-1 text-center border-l border-gray-300 pl-10">
          <div className="form-container border border-gray-300 rounded-lg p-10">
            <h2 className="text-3xl mb-6">Payment Details</h2>
            <form id="payment-form" onSubmit={handleSubmit}>
              <div className="form-group mb-6 text-left">
                <label htmlFor="card-element" className="block mb-2 text-xl">
                  Card Number
                </label>
                <CardElement
                  id="card-element"
                  className="w-full p-4 border border-gray-300 rounded mb-4"
                />

                <label htmlFor="cardholder-name" className="block mb-2 text-xl">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardholder-name"
                  name="cardholder-name"
                  placeholder="John Doe"
                  required
                  className="w-full p-4 border border-gray-300 rounded mb-4"
                />
              </div>
              <div
                id="card-errors"
                role="alert"
                className="text-red-500 mb-4 text-lg"
              ></div>
              <button
                id="submit"
                className="w-full p-4 bg-blue-600 text-white rounded text-xl"
              >
                Save and Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default Payment;
