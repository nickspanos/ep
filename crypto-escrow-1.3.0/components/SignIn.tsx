import Image from 'next/future/image'
import LogoImage from "../images/logo.png"

export const SignIn = ({ logIn }: any) => {
    return (
        <div className="row vh-100 justify-content-center align-items-center">
            <div className="col-lg-4 col-md-6">
                <div className="login-card">
                    <Image className="logo" src={LogoImage} width={100} height={100} alt={process.env.NEXT_PUBLIC_APP_NAME??'EscrowHub'}/>
                    <h3>LogIn To Access</h3>
                    <button
                        className="btn btn-warning btn-lg w-100"
                        onClick={logIn}
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    )
}