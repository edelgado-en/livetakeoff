import { useForm } from "react-hook-form";


const UserPassword = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = () => {

    }

    return (
        <form className="divide-y divide-gray-200 lg:col-span-9" onSubmit={onSubmit}>
            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                <div>
                    <h2 className="text-lg font-medium leading-6 text-gray-900">Password</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        
                    </p>
                </div>
            </div>
        </form>
    )
}

export default UserPassword;