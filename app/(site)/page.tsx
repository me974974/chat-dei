import Image from "next/image";

import AuthForm from "./components/AuthForm";

export default function Home() {
    return (
      <div
        className="
            flex
            min-h-full
            flex-col
            justify-center
            py-12
            sm:px-6
            lg:px-8
            bg-[#818181]
        "
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Image 
            alt="Logo"
            height="70"
            width="70"
            className="mx-auto w-auto"
            src='/images/New_Logo_Chat_Dei.png'
          />
          <h2
            className="
              mt-6
              text-center
              text-3xl
              font-bold
              tracking-tight
              text-gray-900
            "
          >
            Connectez-vous à votre compte
          </h2>
        </div>
        <AuthForm />
      </div>
    )
  }
