import AnimatedPage from "../../components/animatedPage/AnimatedPage";


const PrivacyPolicy = () => {

    return (
        <AnimatedPage>
            <div className="xl:px-16 px-1 m-auto max-w-5xl pb-20">
                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 text-center mt-10">Privacy Policy</h1>
                <p className="mt-4 text-base leading-7 text-slate-600 text-center">Last updated on November 3, 2022</p>
                <div className="relative px-4 sm:px-6 lg:px-8 text-sm text-gray-500 mt-20" style={{ lineHeight: '1.7142857' }}>
                    <div className="mx-auto max-w-[40rem] prose-sm prose prose-slate prose-a:font-semibold
                                 prose-a:text-sky-500 hover:prose-a:text-sky-600">
                        <p>This privacy policy ("Policy") describes how Livetakeoff. ("Livetakeoff", "we", "us" or "our")
                            collects, protects and uses the personally identifiable information ("Personal Information")
                            you ("User", "you" or "your") may provide through the Livetakeoff website (livetakeoff.com).
                            The Policy also describes the choices available to you regarding our use of your Personal
                            Information and how you can access and update this information. This Policy does not apply
                            to the practices of companies that we do not own or control, or to individuals that we do not employ
                            or manage.
                        </p>

                        <h2 className="font-bold mt-6 text-black">Contacting us</h2>
                        <p>If you have any questions about this Policy, please contact us by
                             email at <a href="mailto:support@livetakeoff.com" className="text-sky-500 font-medium">support@livetakeoff.com</a>.
                        </p>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    )
}

export default PrivacyPolicy;