"use client";

import { useEffect, useState } from "react";
import {
    getSellerProfile,
    updateSellerProfile
} from "@/lib/seller-profile";

type InputProps = {
    label: string;
    name: string;
    value: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    disabled: boolean;
};

function InputField({
    label,
    name,
    value,
    onChange,
    disabled,
}: InputProps) {

    return (
        <div>
            <label className="font-semibold block mb-2">
                {label}
            </label>

            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="
                    w-full
                    border
                    rounded-xl
                    p-3
                    outline-none
                    disabled:bg-gray-100
                "
            />
        </div>
    );
}

export default function SellerProfilePage() {

    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    const [signatureFile, setSignatureFile] =
        useState<File | null>(null);

    const [passwordEditMode, setPasswordEditMode] =
        useState(false);

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [formData, setFormData] = useState({
        businessName: "",
        businessType: "",
        sellerName: "",
        gstNumber: "",
        panNumber: "",
        bankAccountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        mobileNumber: "",
        address: "",
        email: "",
        productDescription: "",
        digitalSignatureUrl: "",
        status: "",
    });

    useEffect(() => {
        fetchSellerProfile();
    }, []);

    const fetchSellerProfile = async () => {

        try {

            const response = await getSellerProfile();

            setFormData(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignatureChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (file) {

            setSignatureFile(file);

            setFormData({
                ...formData,
                digitalSignatureUrl:
                    URL.createObjectURL(file),
            });
        }
    };

    const updateProfile = async () => {

        try {

            const data = new FormData();

            Object.entries(formData).forEach(
                ([key, value]) => {
                    data.append(key, value);
                }
            );

            if (signatureFile) {
                data.append(
                    "digitalSignature",
                    signatureFile
                );
            }

            await updateSellerProfile(data);

            alert("Profile Updated Successfully");

            setEditMode(false);

        } catch (error) {

            console.log(error);
        }
    };

    if (loading) {

        return (
            <div className="p-10 text-xl font-semibold">
                Loading...
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            <div className="
                max-w-5xl
                mx-auto
                bg-white
                rounded-2xl
                shadow-md
                p-8
            ">

                {/* TOP */}

                <div className="
                    flex
                    items-center
                    justify-between
                    mb-8
                ">

                    <div>

                        <h1 className="text-3xl font-bold">
                            Seller Profile
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Manage your account details
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            setEditMode(!editMode)
                        }
                        className="
                            bg-green-600
                            text-white
                            px-5
                            py-2
                            rounded-lg
                        "
                    >
                        {editMode ? "Cancel" : "Edit"}
                    </button>

                </div>

                {/* STATUS */}

                <div className="mb-8">

                    <span className="
                        bg-green-100
                        text-green-700
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                    ">
                        {formData.status}
                    </span>

                </div>

                {/* FORM */}

                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-6
                ">

                    <InputField
                        label="Business Name"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        disabled={!editMode}
                    />

                    <InputField
                        label="Business Type"
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        disabled={!editMode}
                    />

                    <InputField
                        label="Seller Name"
                        name="sellerName"
                        value={formData.sellerName}
                        onChange={handleChange}
                        disabled={!editMode}
                    />

                    <InputField
                        label="GST Number"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        disabled={!editMode}
                    />

                    <InputField
                        label="PAN Number"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        disabled={!editMode}
                    />

                    <InputField
                        label="Bank Account Number"
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleChange}
                        disabled={!editMode}
                    />

                    <InputField
                        label="IFSC Code"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        disabled={!editMode}
                    />

                    <InputField
                        label="Account Holder Name"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        disabled={!editMode}
                    />

                    <InputField
                        label="Mobile Number"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        disabled={!editMode}
                    />

                    <InputField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!editMode}
                    />

                </div>

                {/* SIGNATURE + PASSWORD */}

                <div className="
                    mt-8
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-6
                ">

                    {/* DIGITAL SIGNATURE */}

                    <div className="
                        border
                        rounded-2xl
                        p-5
                        bg-gray-50
                        shadow-sm
                    ">

                        <label className="
                            font-semibold
                            text-lg
                            block
                            mb-4
                        ">
                            Digital Signature
                        </label>

                        {
                            formData.digitalSignatureUrl ? (

                                <img
                                    src={
                                        formData.digitalSignatureUrl
                                    }
                                    alt="Digital Signature"
                                    className="
                                        w-full
                                        h-36
                                        object-contain
                                        border
                                        rounded-xl
                                        bg-white
                                        p-3
                                        mb-4
                                    "
                                />

                            ) : (

                                <div className="
                                    h-36
                                    flex
                                    items-center
                                    justify-center
                                    border
                                    rounded-xl
                                    bg-white
                                    text-gray-400
                                    mb-4
                                ">
                                    No Signature Uploaded
                                </div>

                            )
                        }

                        {editMode && (

                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleSignatureChange
                                }
                                className="
                                    block
                                    w-full
                                    border
                                    border-gray-300
                                    rounded-xl
                                    bg-gray-100
                                    px-4
                                    py-3
                                    text-sm
                                "
                            />

                        )}

                    </div>

                    {/* CHANGE PASSWORD */}

                    <div className="
                        border
                        rounded-2xl
                        p-5
                        bg-gray-50
                        shadow-sm
                    ">

                        <div className="
                            flex
                            items-center
                            justify-between
                            mb-4
                        ">

                            <h2 className="
                                text-lg
                                font-semibold
                            ">
                                Security
                            </h2>

                            <div className="
                                bg-green-100
                                text-green-700
                                text-xs
                                font-semibold
                                px-3
                                py-1
                                rounded-full
                            ">
                                Protected
                            </div>

                        </div>

                        <p className="
                            text-gray-500
                            text-sm
                            mb-6
                        ">
                            Change your seller account password
                        </p>

                        {passwordEditMode && (

                            <div className="
                                space-y-4
                                mt-4
                            ">

                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    value={
                                        passwordData.oldPassword
                                    }
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            oldPassword:
                                                e.target.value,
                                        })
                                    }
                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        p-3
                                    "
                                />

                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={
                                        passwordData.newPassword
                                    }
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            newPassword:
                                                e.target.value,
                                        })
                                    }
                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        p-3
                                    "
                                />

                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={
                                        passwordData.confirmPassword
                                    }
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            confirmPassword:
                                                e.target.value,
                                        })
                                    }
                                    className="
                                        w-full
                                        border
                                        rounded-xl
                                        p-3
                                    "
                                />

                                <button
                                    className="
                                        w-full
                                        bg-green-600
                                        text-white
                                        py-3
                                        rounded-xl
                                        font-semibold
                                    "
                                >
                                    Update Password
                                </button>

                            </div>

                        )}

                        <button
                            onClick={() =>
                                setPasswordEditMode(
                                    !passwordEditMode
                                )
                            }
                            className="
                                mt-6
                                w-full
                                bg-black
                                text-white
                                py-3
                                rounded-xl
                                font-semibold
                            "
                        >
                            {
                                passwordEditMode
                                    ? "Cancel"
                                    : "Change Password"
                            }
                        </button>

                    </div>

                </div>

                {/* ADDRESS */}

                <div className="mt-8">

                    <label className="
                        font-semibold
                        block
                        mb-2
                    ">
                        Address
                    </label>

                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!editMode}
                        rows={4}
                        className="
                            w-full
                            border
                            rounded-xl
                            p-4
                            outline-none
                        "
                    />

                </div>

                {/* PRODUCT DESCRIPTION */}

                <div className="mt-8">

                    <label className="
                        font-semibold
                        block
                        mb-2
                    ">
                        Product Description
                    </label>

                    <textarea
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleChange}
                        disabled={!editMode}
                        rows={5}
                        className="
                            w-full
                            border
                            rounded-xl
                            p-4
                            outline-none
                        "
                    />

                </div>

                {/* UPDATE BUTTON */}

                {editMode && (

                    <div className="mt-8">

                        <button
                            onClick={updateProfile}
                            className="
                                bg-green-600
                                hover:bg-green-700
                                text-white
                                px-8
                                py-3
                                rounded-xl
                                font-semibold
                            "
                        >
                            Update Profile
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}